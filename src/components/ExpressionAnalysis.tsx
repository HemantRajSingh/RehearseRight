import React from 'react';
import { Camera } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';

interface Expression {
  label: string;
  probability: number;
}

interface ExpressionAnalysisProps {
  expressions?: Expression[];
  currentEmotion: string;
}

export const ExpressionAnalysis: React.FC<ExpressionAnalysisProps> = ({ expressions = [], currentEmotion }) => {
  return (
    <AnalysisCard icon={<Camera className="w-5 h-5 text-blue-500" />} title="Expression Analysis">
      <div className="mb-4">
        <div className="text-4xl font-bold text-blue-500">
          {Math.round(expressions[0]?.probability * 100 || 0)}%
        </div>
        <div className="text-sm text-gray-600">Current Emotion: {currentEmotion}</div>
      </div>
      <div className="space-y-2">
        {Array.isArray(expressions) && expressions.map((expression, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{expression.label}</div>
            <div className="text-sm text-gray-600">{Math.round(expression.probability * 100)}%</div>
          </div>
        ))}
      </div>
    </AnalysisCard>
  );
};