import React from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export const CameraPlaceholder: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400"
    >
      <Camera className="w-16 h-16 mb-4" />
      <p className="text-lg">Click "Start Recording" to activate camera</p>
    </motion.div>
  );
};