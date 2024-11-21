import React from 'react';
import { EmotionChart } from './EmotionChart';
import { Volume2, Mic, Brain } from 'lucide-react';

interface FeedbackPanelProps {
  emotions: { emotion: string; value: number; }[];
  voiceMetrics: {
    pitch: number;
    volume: number;
    speed: number;
  };
  sentiment: {
    score: number;
    label: string;
  };
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  emotions,
  voiceMetrics,
  sentiment,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Emotional Analysis</h3>
          <EmotionChart data={emotions} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Voice Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Volume2 className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-sm text-gray-600">Volume</div>
              <div className="text-lg font-semibold">{voiceMetrics.volume}dB</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Mic className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-sm text-gray-600">Pitch</div>
              <div className="text-lg font-semibold">{voiceMetrics.pitch}Hz</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Brain className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-sm text-gray-600">Speed</div>
              <div className="text-lg font-semibold">{voiceMetrics.speed} wpm</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Sentiment:</span>
              <span className={`font-semibold ${
                sentiment.score > 0.5 ? 'text-green-600' : 
                sentiment.score < 0.3 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {sentiment.label}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${sentiment.score * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};