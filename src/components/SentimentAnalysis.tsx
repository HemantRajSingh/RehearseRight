import React from 'react';
import { Brain } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';

interface SentimentAnalysisProps {
  score: number;
  label: string;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ score, label }) => {
  return (
    <AnalysisCard icon={<Brain className="w-5 h-5 text-green-500" />} title="Sentiment Analysis">
      <div className="mb-4">
        <div className="text-4xl font-bold text-green-500">
          {Math.round(score * 100)}%
        </div>
        <div className="text-sm text-gray-600">Content Positivity</div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Overall Sentiment:</div>
        <div className="text-lg font-medium">{label}</div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>
    </AnalysisCard>
  );
};