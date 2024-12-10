from transformers import pipeline
import torch
import logging

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        self._load_model()

    def _load_model(self):
        try:
            self.analyzer = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment",
                device=0 if torch.cuda.is_available() else -1
            )
            logger.info("Sentiment analysis model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading sentiment model: {str(e)}")
            raise

    async def analyze_sentiment(self, text: str) -> dict:
        try:
            result = self.analyzer(text)[0]
            score = result['score']
            label = result['label']
            
            label_map = {
                "LABEL_0": "Negative",
                "LABEL_1": "Neutral",
                "LABEL_2": "Positive"
            }
            custom_label = label_map.get(label, "Unknown")
            
            return {
                "score": float(score),
                "label": custom_label
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {"score": 0.5, "label": "Error"}