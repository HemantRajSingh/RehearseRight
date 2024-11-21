import React from 'react';
import { Activity } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';
import { motion } from 'framer-motion';

interface SpeechTranscriptProps {
  transcript: string;
  isRecording: boolean;
}

export const SpeechTranscript: React.FC<SpeechTranscriptProps> = ({ transcript, isRecording }) => {
  return (
    <AnalysisCard icon={<Activity className="w-5 h-5 text-red-500" />} title="Speech Transcript">
      <div className="relative min-h-[200px] bg-gray-50 rounded-lg p-4">
        {transcript ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {transcript}
          </motion.p>
        ) : (
          <p className="text-gray-400">
            {isRecording ? "Listening..." : "Start speaking..."}
          </p>
        )}
        {isRecording && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </div>
        )}
      </div>
    </AnalysisCard>
  );
};