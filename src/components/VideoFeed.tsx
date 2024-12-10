import React from 'react';
import Webcam from 'react-webcam';

interface VideoFeedProps {
  isRecording: boolean;
  webcamRef: React.RefObject<Webcam>;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ isRecording, webcamRef }) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900">
      <Webcam
        ref={webcamRef}
        audio={false}
        className="w-full rounded-xl"
        mirrored={true}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user"
        }}
      />
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center bg-black/50 px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
          <span className="text-white text-sm font-medium">Recording</span>
        </div>
      )}
    </div>
  );
};