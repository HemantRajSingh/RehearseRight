import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoFeed } from './components/VideoFeed';
import { ExpressionAnalysis } from './components/ExpressionAnalysis';
import { VoiceAnalysis } from './components/VoiceAnalysis';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { SpeechTranscript } from './components/SpeechTranscript';
import { AnalysisSummary } from './components/AnalysisSummary';
import { useWebSocket } from './hooks/useWebSocket';
import { useEmotionDetection } from './hooks/useEmotionDetection';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [expressions, setExpressions] = useState([
    { label: 'Happy', probability: 0 },
    { label: 'Neutral', probability: 0 },
    { label: 'Concerned', probability: 0 },
    { label: 'Serious', probability: 0 }
  ]);
  const [voiceMetrics, setVoiceMetrics] = useState({
    clarity: 0,
    pace: 0,
    volume: 0
  });
  const [sentiment, setSentiment] = useState({
    score: 0,
    label: 'Neutral'
  });

  const webcamRef = useRef<Webcam>(null);
  const { detectEmotions } = useEmotionDetection();
  const { startRecognition, stopRecognition, transcript: speechTranscript } = useSpeechRecognition();

  const { connect, disconnect, sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'emotions') {
        setExpressions(data.data);
      } else if (data.type === 'voice') {
        setVoiceMetrics(data.data);
      } else if (data.type === 'sentiment') {
        setSentiment(data.data);
      }
    }
  });

  useEffect(() => {
    if (speechTranscript) {
      setTranscript(speechTranscript);
      if (isRecording) {
        sendMessage({
          type: 'analyze_sentiment',
          data: speechTranscript
        });
      }
    }
  }, [speechTranscript, isRecording, sendMessage]);

  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      connect();
      startRecognition();
      setShowSummary(false);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [connect, startRecognition]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    disconnect();
    stopRecognition();
    setShowSummary(true);
  }, [disconnect, stopRecognition]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">RehearseRight</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`
              px-6 py-3 rounded-full font-medium flex items-center gap-2
              ${isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'}
            `}
          >
            <Mic className="w-5 h-5" />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </motion.button>
        </div>

        <div className="mb-8">
          <VideoFeed isRecording={isRecording} webcamRef={webcamRef} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExpressionAnalysis 
            expressions={expressions}
            currentEmotion={expressions[0]?.label || 'Neutral'}
          />
          <VoiceAnalysis metrics={voiceMetrics} />
          <SentimentAnalysis {...sentiment} />
        </div>

        <SpeechTranscript 
          transcript={transcript}
          isRecording={isRecording}
        />

        {showSummary && (
          <AnalysisSummary
            emotions={expressions}
            voiceMetrics={voiceMetrics}
            sentiment={sentiment}
            onClose={() => setShowSummary(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;