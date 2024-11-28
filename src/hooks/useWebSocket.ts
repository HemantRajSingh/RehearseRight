import { useEffect, useRef, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface WebSocketHookOptions {
  onMessage: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

export const useWebSocket = ({
  onMessage,
  onError,
  onClose,
}: WebSocketHookOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sessionId = useRef(uuidv4());
  const videoFrameInterval = useRef<number>();
  const audioInterval = useRef<number>();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/${sessionId.current}`;

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        onError?.(error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
        setIsConnected(false);
        onClose?.();
      };

      // Start sending video frames
      videoFrameInterval.current = window.setInterval(() => {
        const video = document.querySelector("video");
        if (video && ws.current?.readyState === WebSocket.OPEN) {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const frameData = canvas.toDataURL("image/jpeg", 0.8);
            ws.current.send(
              JSON.stringify({
                type: "frame",
                data: frameData,
              })
            );
          }
        }
      }, 1000);

      // Start sending audio data
      if (navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(1024, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
              if (ws.current?.readyState === WebSocket.OPEN) {
                const inputData = e.inputBuffer.getChannelData(0);
                const audioData = btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(inputData.buffer)
                  )
                );
                ws.current.send(
                  JSON.stringify({
                    type: "audio",
                    data: audioData,
                  })
                );
              }
            };
          })
          .catch((err) => console.error("Error accessing microphone:", err));
      }
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setIsConnected(false);
    }
  }, [onMessage, onError, onClose]);

  const disconnect = useCallback(() => {
    if (videoFrameInterval.current) {
      clearInterval(videoFrameInterval.current);
    }
    if (audioInterval.current) {
      clearInterval(audioInterval.current);
    }
    if (ws.current) {
      ws.current.close();
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback((data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, sendMessage, isConnected };
};
