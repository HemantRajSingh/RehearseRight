import librosa
import numpy as np
from io import BytesIO
import logging
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor
import torch

logger = logging.getLogger(__name__)

class VoiceAnalyzer:
    def __init__(self):
        # Load pretrained audio classification model and processor
        self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
            "superb/wav2vec2-base-superb-ks"
        )
        self.labels = [
            "silence",
            "unknown",
            "yes",
            "no",
            "up",
            "down",
            "left",
            "right",
            "on",
            "off",
            "stop",
            "go",
        ]  # Sample labels for the model

    async def analyze_audio(self, audio_data: bytes) -> dict:
        try:
            # Load audio data for analysis
            y, sr = librosa.load(BytesIO(audio_data), sr=None)
            
            # Feature extraction for metrics
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            rms = librosa.feature.rms(y=y)
            
            clarity = np.mean(mfccs) * 100
            pace = np.mean(spectral_centroids) * 100
            volume = np.mean(rms) * 100
            
            metrics = {
                "clarity": min(max(clarity, 0), 100),
                "pace": min(max(pace, 0), 100),
                "volume": min(max(volume, 0), 100)
            }

            # Prepare audio data for classification
            inputs = self.processor(y, sampling_rate=sr, return_tensors="pt", padding=True)
            
            with torch.no_grad():
                logits = self.model(**inputs).logits
            
            predicted_ids = torch.argmax(logits, dim=-1)
            predicted_label = self.labels[predicted_ids[0].item()]
            
            metrics["classification"] = predicted_label
            
            return {k: (float(v) if isinstance(v, (int, float)) else v) for k, v in metrics.items()}
        
        except Exception as e:
            logger.error(f"Error analyzing audio: {str(e)}")
            return {"clarity": 0, "pace": 0, "volume": 0, "classification": "error"}
