import React from 'react';

interface Emotion {
  label: string;
  probability: number;
}

interface EmotionListProps {
  emotions: Emotion[];
}

export const EmotionList: React.FC<EmotionListProps> = ({ emotions }) => {
  return (
    <div className="space-y-2">
      {emotions.map((emotion, index) => (
        <div
          key={`${emotion.label}-${index}`}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100"
        >
          <span className="font-medium text-gray-700">{emotion.label}</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${emotion.probability * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 min-w-[3.5rem] text-right">
              {(emotion.probability * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};