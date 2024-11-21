import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ icon, title, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
};