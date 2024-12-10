import { useState, useCallback, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();

      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      newRecognition.onresult = (event) => {
        let finalTranscript = "";
        let newInterimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            newInterimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript((prevTranscript) => {
          return (prevTranscript + " " + finalTranscript).trim();
        });
        setInterimTranscript(newInterimTranscript);
      };

      newRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      setRecognition(newRecognition);
    } else {
      console.warn("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startRecognition = useCallback(() => {
    if (recognition) {
      setTranscript("");
      setInterimTranscript("");
      recognition.start();
    }
  }, [recognition]);

  const stopRecognition = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    transcript: transcript + (interimTranscript ? " " + interimTranscript : ""), // Combine final and interim transcripts
    startRecognition,
    stopRecognition,
    isSupported: !!recognition,
  };
};
