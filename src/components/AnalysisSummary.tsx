import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisSummaryProps {
  emotions: { label: string; probability: number }[];
  voiceMetrics: {
    clarity: number;
    pace: number;
    volume: number;
  };
  sentiment: {
    score: number;
    label: string;
  };
  onClose: () => void;
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  emotions,
  voiceMetrics,
  sentiment,
  onClose,
}) => {
  const getFeedback = () => {
    const feedback = [];

    // Emotion feedback
    const dominantEmotion = emotions[0];
    if (dominantEmotion?.label === 'Happy' || dominantEmotion?.label === 'Neutral') {
      feedback.push({
        type: 'positive',
        message: 'Your facial expressions show confidence and engagement.',
      });
    } else {
      feedback.push({
        type: 'negative',
        message: 'Try to maintain more positive facial expressions.',
      });
    }

    // Voice feedback
    const avgVoiceScore = (voiceMetrics.clarity + voiceMetrics.pace + voiceMetrics.volume) / 3;
    if (avgVoiceScore > 70) {
      feedback.push({
        type: 'positive',
        message: 'Your voice projection and clarity are excellent.',
      });
    } else {
      feedback.push({
        type: 'negative',
        message: 'Consider improving voice clarity and pace.',
      });
    }

    // Sentiment feedback
    if (sentiment.score > 0.6) {
      feedback.push({
        type: 'positive',
        message: 'Your content maintains a positive and engaging tone.',
      });
    } else {
      feedback.push({
        type: 'neutral',
        message: 'Try to incorporate more positive language in your presentation.',
      });
    }

    return feedback;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Analysis Summary</h2>
        
        <div className="space-y-6">
          {getFeedback().map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{
                backgroundColor: item.type === 'positive' ? '#f0fdf4' : 
                               item.type === 'negative' ? '#fef2f2' : '#fefce8'
              }}
            >
              {item.type === 'positive' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : item.type === 'negative' ? (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              )}
              <p className="text-gray-700">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};