"""FRIDAY Backend - Voice Router"""
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, UploadFile, File
from sqlalchemy.orm import Session
import logging
import json

from app.database import get_db
from app.services import JWTHandler
from app.services.voice_service import VoiceService
from app.services.command_parser import CommandParser
from app.services.wake_word_detector import WakeWordDetector
from fastapi.security import HTTPBearer, HTTPAuthCredentials

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(
    prefix="/voice",
    tags=["Voice"],
)

# Initialize services
voice_service = VoiceService()
command_parser = CommandParser()
wake_word_detector = WakeWordDetector()


def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    """Get current user from token."""
    token = credentials.credentials
    token_data = JWTHandler.decode_token(token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    return token_data


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = ""):
    """WebSocket endpoint for real-time voice communication."""
    # Verify token
    token_data = JWTHandler.decode_token(token)
    if not token_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await websocket.accept()
    logger.info(f"WebSocket connection established for user {token_data.user_id}")
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle voice stream
            if message.get('type') == 'audio_chunk':
                # TODO: Process audio chunk
                await websocket.send_json({
                    'type': 'audio_received',
                    'status': 'success'
                })
            
            # Handle transcription request
            elif message.get('type') == 'transcribe':
                audio_data = message.get('audio')
                language = message.get('language', 'en')
                
                # TODO: Process transcription
                await websocket.send_json({
                    'type': 'transcription',
                    'text': 'Transcribed text would appear here',
                    'status': 'success'
                })
            
            # Handle command parsing
            elif message.get('type') == 'parse_command':
                text = message.get('text', '')
                language = message.get('language', 'en')
                
                # Check for wake word
                has_wake_word, confidence = wake_word_detector.detect_wake_word(text, language)
                
                if has_wake_word:
                    # Remove wake word and parse command
                    clean_text = wake_word_detector.remove_wake_word(text, language)
                    parsed = command_parser.parse_command(clean_text, language)
                    
                    await websocket.send_json({
                        'type': 'command',
                        'command': parsed['command_type'],
                        'entities': parsed['entities'],
                        'status': 'success'
                    })
                else:
                    # No wake word detected, treat as chat
                    await websocket.send_json({
                        'type': 'chat',
                        'text': text,
                        'status': 'success'
                    })
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user {token_data.user_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.send_json({
            'type': 'error',
            'message': str(e)
        })


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = "en",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Transcribe audio file to text."""
    try:
        audio_data = await file.read()
        
        # Transcribe audio
        transcription = await voice_service.transcribe_audio(audio_data, language)
        
        if not transcription:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to transcribe audio",
            )
        
        return {
            'success': True,
            'message': 'Audio transcribed successfully',
            'data': {
                'text': transcription,
                'language': language,
            }
        }
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error transcribing audio",
        )


@router.post("/synthesize")
async def synthesize_speech(
    data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Synthesize text to speech."""
    try:
        text = data.get('text', '')
        language = data.get('language', 'en')
        gender = data.get('gender', 'FEMALE')
        
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Text is required",
            )
        
        # Synthesize speech
        audio_data = await voice_service.synthesize_speech(text, language, gender)
        
        if not audio_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to synthesize speech",
            )
        
        return {
            'success': True,
            'message': 'Speech synthesized successfully',
            'data': {
                'audio': audio_data.hex(),  # Convert bytes to hex string
                'language': language,
                'gender': gender,
            }
        }
    except Exception as e:
        logger.error(f"Synthesis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error synthesizing speech",
        )


@router.post("/parse-command")
async def parse_voice_command(
    data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Parse voice command."""
    try:
        text = data.get('text', '')
        language = data.get('language', 'en')
        
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Text is required",
            )
        
        # Check for wake word
        has_wake_word, confidence = wake_word_detector.detect_wake_word(text, language)
        
        # Remove wake word if present
        clean_text = wake_word_detector.remove_wake_word(text, language) if has_wake_word else text
        
        # Parse command
        parsed = command_parser.parse_command(clean_text, language)
        
        return {
            'success': True,
            'message': 'Command parsed successfully',
            'data': {
                'wake_word_detected': has_wake_word,
                'confidence': confidence,
                'command_type': parsed['command_type'],
                'entities': parsed['entities'],
            }
        }
    except Exception as e:
        logger.error(f"Command parsing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error parsing command",
        )
