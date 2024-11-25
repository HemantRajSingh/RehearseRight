import librosa
import numpy as np
from io import BytesIO
import logging
import tensorflow as tf
import tensorflow_hub as hub

logger = logging.getLogger(__name__)

class VoiceAnalyzer:
    def __init__(self):
        # Load a pretrained audio classification model from TensorFlow Hub
        self.model = hub.load("https://tfhub.dev/google/yamnet/1")  # YAMNet for audio classification
        self.labels_path = tf.keras.utils.get_file(
            'yamnet_class_map.csv',
            'https://storage.googleapis.com/audioset/yamnet_class_map.csv'
        )
        self.labels = self._load_labels()

    def _load_labels(self):
        with open(self.labels_path, "r") as file:
            return [line.strip().split(",")[1] for line in file.readlines()[1:]]

    async def analyze_audio(self, audio_data: bytes) -> dict:
        try:
            # Load and preprocess audio data for librosa-based feature extraction
            y, sr = librosa.load(BytesIO(audio_data), sr=None)
            
            # Extract features: MFCCs, spectral centroid, RMS
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

            # Preprocess audio for YAMNet model
            waveform = tf.convert_to_tensor(y, dtype=tf.float32)
            if sr != 16000:
                waveform = tf.audio.resample(waveform, sr, 16000)
            
            waveform = tf.expand_dims(waveform, axis=0)  # Add batch dimension
            
            # Get model predictions
            scores, embeddings, spectrogram = self.model(waveform)
            top_class = tf.argmax(scores[0]).numpy()
            predicted_label = self.labels[top_class]
            
            metrics["classification"] = predicted_label
            
            return {k: (float(v) if isinstance(v, (int, float)) else v) for k, v in metrics.items()}
        
        except Exception as e:
            logger.error(f"Error analyzing audio: {str(e)}")
            return {"clarity": 0, "pace": 0, "volume": 0, "classification": "error"}

