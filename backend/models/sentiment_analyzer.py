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
                model="distilbert-base-uncased-finetuned-sst-2-english",
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
            
            if score >= 0.8:
                label = "Very Positive"
            elif score >= 0.6:
                label = "Positive"
            elif score >= 0.4:
                label = "Neutral"
            elif score >= 0.2:
                label = "Negative"
            else:
                label = "Very Negative"
            
            return {
                "score": float(score),
                "label": label
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {"score": 0.5, "label": "Error"}