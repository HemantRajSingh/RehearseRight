import React from 'react';
import { Mic } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';

interface VoiceMetrics {
  clarity: number;
  pace: number;
  volume: number;
}

interface VoiceAnalysisProps {
  metrics: VoiceMetrics;
}

export const VoiceAnalysis: React.FC<VoiceAnalysisProps> = ({ metrics }) => {
  return (
    <AnalysisCard icon={<Mic className="w-5 h-5 text-purple-500" />} title="Voice Analysis">
      <div className="mb-4">
        <div className="text-4xl font-bold text-purple-500">
          {Math.round((metrics.clarity + metrics.pace) / 2)}%
        </div>
        <div className="text-sm text-gray-600">Clarity and Pace</div>
      </div>
      <div className="space-y-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 capitalize">{key}</span>
              <span className="text-sm text-gray-600">{Math.round(value)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AnalysisCard>
  );
};