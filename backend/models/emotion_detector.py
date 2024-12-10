from tensorflow.keras.models import load_model
from deepface import DeepFace
import base64
import numpy as np
import cv2
import io
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class EmotionDetector:
    def __init__(self):
        logger.info("EmotionDetector initialized")
        
    def preprocess_image(self, frame_data: str) -> np.ndarray:
        try:
            img_data = base64.b64decode(frame_data.split(',')[1])
            image = Image.open(io.BytesIO(img_data))
            opencv_image = np.array(image)
            opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_RGB2BGR)
            return opencv_image
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            return None
        
    async def detect_emotions(self, frame_data: str) -> dict:
        try:
            # image pre-processing
            image = self.preprocess_image(frame_data)
            if image is None:
                return {"label": "No face detected", "probability": 1.0}

            # using deep face to detect emotions
            analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
            
            dominant_emotion = analysis[0]['dominant_emotion']
            emotion_prob = analysis[0]['emotion'][dominant_emotion]
            emotions = analysis[0]['emotion']

            return [{"emotions": emotions, "label": dominant_emotion, "probability": emotion_prob}]
        
        except Exception as e:
            logger.error(f"Error detecting emotions: {str(e)}")
            return [{"label": "Error", "probability": 1.0}]