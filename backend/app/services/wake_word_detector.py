"""FRIDAY Backend - Wake Word Detector"""
import logging
from typing import Optional
from enum import Enum
import re

logger = logging.getLogger(__name__)


class WakeWordDetector:
    """Detector for wake words in speech."""

    def __init__(self):
        """Initialize wake word detector."""
        self.wake_words = {
            'en': ['hey friday', 'hi friday', 'okay friday', 'friday'],
            'hi': ['सुनो friday', 'फ्राइडे', 'फ्राइडे जी'],
            'bn': ['শোনো ফ্রাইডে', 'ফ্রাইডে', 'আমার ফ্রাইডে'],
        }
        self.confidence_threshold = 0.7

    def detect_wake_word(self, text: str, language: str = 'en') -> tuple[bool, float]:
        """Detect if wake word is present in text.
        
        Args:
            text: Speech text
            language: Language code (en, hi, bn)
            
        Returns:
            Tuple of (is_detected, confidence_score)
        """
        text_lower = text.lower().strip()
        wake_words = self.wake_words.get(language, self.wake_words['en'])
        
        for wake_word in wake_words:
            if wake_word in text_lower:
                # Calculate confidence based on exact match or partial match
                if wake_word == text_lower or text_lower.startswith(wake_word):
                    confidence = 1.0
                else:
                    confidence = 0.85
                
                if confidence >= self.confidence_threshold:
                    logger.info(f"Wake word detected: '{wake_word}' (confidence: {confidence})")
                    return True, confidence
        
        return False, 0.0

    def remove_wake_word(self, text: str, language: str = 'en') -> str:
        """Remove wake word from text.
        
        Args:
            text: Speech text with wake word
            language: Language code
            
        Returns:
            Text without wake word
        """
        text_lower = text.lower()
        wake_words = self.wake_words.get(language, self.wake_words['en'])
        
        for wake_word in wake_words:
            if text_lower.startswith(wake_word):
                # Remove wake word and any following whitespace
                cleaned = text[len(wake_word):].strip()
                logger.info(f"Removed wake word '{wake_word}' from text")
                return cleaned
        
        return text

    def add_custom_wake_word(self, word: str, language: str = 'en') -> None:
        """Add custom wake word."""
        if language not in self.wake_words:
            self.wake_words[language] = []
        
        if word not in self.wake_words[language]:
            self.wake_words[language].append(word.lower())
            logger.info(f"Added custom wake word: '{word}' for language {language}")
