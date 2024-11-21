import librosa
import numpy as np
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

class VoiceAnalyzer:
    async def analyze_audio(self, audio_data: bytes) -> dict:
        try:
            y, sr = librosa.load(BytesIO(audio_data), sr=None)
            
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
            
            return {k: float(v) for k, v in metrics.items()}
            
        except Exception as e:
            logger.error(f"Error analyzing audio: {str(e)}")
            return {"clarity": 0, "pace": 0, "volume": 0}