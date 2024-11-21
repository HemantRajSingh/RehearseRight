import { useState, useCallback, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      
      newRecognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(prevTranscript => {
          const newTranscript = prevTranscript + finalTranscript + (interimTranscript ? ' ' + interimTranscript : '');
          return newTranscript.trim();
        });
      };

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(newRecognition);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startRecognition = useCallback(() => {
    if (recognition) {
      setTranscript('');
      recognition.start();
    }
  }, [recognition]);

  const stopRecognition = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    transcript,
    startRecognition,
    stopRecognition,
    isSupported: !!recognition
  };
};