from fastapi import WebSocket
from typing import Dict
import logging
import json
import base64
from models.emotion_detector import EmotionDetector
from models.voice_analyzer import VoiceAnalyzer
from models.sentiment_analyzer import SentimentAnalyzer

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.emotion_detector = EmotionDetector()
        self.voice_analyzer = VoiceAnalyzer()
        self.sentiment_analyzer = SentimentAnalyzer()
        
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected")
        
    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)
        logger.info(f"Client {client_id} disconnected")
        
    async def handle_message(self, websocket: WebSocket, data: dict):
        try:
            if data["type"] == "frame":
                emotions = await self.emotion_detector.detect_emotions(data["data"])
                await websocket.send_json({
                    "type": "emotions",
                    "data": emotions
                })
                
            elif data["type"] == "audio":
                metrics = await self.voice_analyzer.analyze_audio(
                    base64.b64decode(data["data"])
                )
                await websocket.send_json({
                    "type": "voice",
                    "data": metrics
                })
                
            elif data["type"] == "analyze_sentiment":
                sentiment = await self.sentiment_analyzer.analyze_sentiment(data["data"])
                await websocket.send_json({
                    "type": "sentiment",
                    "data": sentiment
                })
                
        except Exception as e:
            logger.error(f"Error handling message: {str(e)}")
            await websocket.send_json({
                "type": "error",
                "message": "Error processing request"
            })