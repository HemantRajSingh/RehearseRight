import librosa
import numpy as np
from io import BytesIO
import base64
from pydub import AudioSegment
import logging

logger = logging.getLogger(__name__)

class VoiceAnalyzer:
    async def analyze_audio(self, audio_data: bytes) -> dict:
        try:
            audio_segment = AudioSegment(
                data=audio_data,
                sample_width=2, 
                frame_rate=16000,  
                channels=1
            )
            
            wav_io = BytesIO()
            audio_segment.export(wav_io, format="wav")
            wav_io.seek(0)

            # using librosa to load the audio
            y, sr = librosa.load(wav_io, sr=None)
            
            # extracting the audio features
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            rms = librosa.feature.rms(y=y)
            
            # Clarity: Averaging the MFCCs to give a measure of clarity
            clarity = np.mean(mfccs) * 100

            # Pace: Averaging the spectral centroids for pace of speech
            pace = np.mean(spectral_centroids) * 100

            # Volume: Averaging the root mean square (RMS) value for speech volume
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