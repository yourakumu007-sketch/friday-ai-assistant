"""FRIDAY Backend - Command Parser Service"""
import logging
import re
from typing import Optional, Dict, Any, List
from enum import Enum
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class CommandType(str, Enum):
    """Types of voice commands."""
    TASK_CREATE = "task_create"
    TASK_UPDATE = "task_update"
    TASK_LIST = "task_list"
    TASK_DELETE = "task_delete"
    REMINDER_CREATE = "reminder_create"
    REMINDER_LIST = "reminder_list"
    CHAT = "chat"
    WEATHER = "weather"
    MUSIC = "music"
    TIME = "time"
    DATE = "date"
    SEARCH = "search"
    UNKNOWN = "unknown"


class CommandParser:
    """Parser for voice commands."""

    def __init__(self):
        """Initialize command parser with command patterns."""
        self.command_patterns = {
            CommandType.TASK_CREATE: [
                r'(?:create|add|new)\s+(?:a\s+)?(?:task|todo)',
                r'(?:remember|remind)\s+(?:me\s+)?(?:to|about)',
            ],
            CommandType.TASK_LIST: [
                r'(?:show|list|get)\s+(?:my\s+)?(?:tasks|todos)',
                r'what are my tasks',
            ],
            CommandType.TASK_DELETE: [
                r'(?:delete|remove|cancel)\s+(?:task|todo)',
            ],
            CommandType.REMINDER_CREATE: [
                r'(?:remind|set a reminder)',
                r'(?:set|create)\s+an?\s+(?:alarm|reminder)',
            ],
            CommandType.REMINDER_LIST: [
                r'(?:show|list)\s+(?:my\s+)?(?:reminders|alarms)',
            ],
            CommandType.WEATHER: [
                r'(?:what\'?s?|hows?)\s+(?:the\s+)?weather',
                r'(?:is it raining|temperature)',
            ],
            CommandType.MUSIC: [
                r'(?:play|start)\s+(?:some\s+)?(?:music|song)',
                r'(?:put on|queue)\s+(?:a\s+)?(?:song|music)',
            ],
            CommandType.TIME: [
                r'(?:what\'?s?|tell me)\s+(?:the\s+)?time',
                r'(?:current\s+)?time',
            ],
            CommandType.DATE: [
                r'(?:what\'?s?|tell me)\s+(?:the\s+)?(?:date|day)',
                r'(?:what day|date is it)',
            ],
        }

    def parse_command(self, text: str, language: str = 'en') -> Dict[str, Any]:
        """Parse voice command text.
        
        Args:
            text: Voice command text
            language: Language code (en, hi, bn)
            
        Returns:
            Dictionary with command type, action, and extracted data
        """
        text_lower = text.lower().strip()
        
        # Detect command type
        command_type = self._detect_command_type(text_lower)
        
        # Extract entities based on command type
        entities = self._extract_entities(text_lower, command_type)
        
        logger.info(f"Parsed command: {command_type} with entities: {entities}")
        
        return {
            'command_type': command_type,
            'text': text,
            'entities': entities,
            'language': language,
            'timestamp': datetime.utcnow().isoformat(),
        }

    def _detect_command_type(self, text: str) -> CommandType:
        """Detect the type of command from text."""
        for cmd_type, patterns in self.command_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    return cmd_type
        
        return CommandType.UNKNOWN

    def _extract_entities(self, text: str, command_type: CommandType) -> Dict[str, Any]:
        """Extract entities from command text based on command type."""
        entities = {}
        
        if command_type == CommandType.TASK_CREATE:
            # Extract task title
            match = re.search(r'(?:task|todo)\s+(?:to\s+)?([a-zA-Z0-9\s]+?)(?:\s+by|\s+on|$)', text)
            if match:
                entities['title'] = match.group(1).strip()
            
            # Extract priority
            if any(word in text for word in ['urgent', 'important', 'high']):
                entities['priority'] = 'HIGH'
            elif any(word in text for word in ['low', 'minor']):
                entities['priority'] = 'LOW'
            else:
                entities['priority'] = 'MEDIUM'
            
            # Extract due date
            due_date = self._extract_date(text)
            if due_date:
                entities['due_date'] = due_date
        
        elif command_type == CommandType.REMINDER_CREATE:
            # Extract reminder text
            match = re.search(r'(?:remind|alarm)\s+(?:me\s+)?(?:to\s+)?([a-zA-Z0-9\s]+?)(?:\s+at|\s+in|$)', text)
            if match:
                entities['title'] = match.group(1).strip()
            
            # Extract time
            time_match = re.search(r'(?:at|in)\s+([0-9]{1,2}):([0-9]{2})(?:\s*(?:am|pm))?', text)
            if time_match:
                entities['time'] = f"{time_match.group(1)}:{time_match.group(2)}"
        
        elif command_type == CommandType.MUSIC:
            # Extract song or artist name
            match = re.search(r'(?:play|song)\s+(?:a\s+)?(?:song by\s+)?([a-zA-Z\s]+?)(?:\s+by|$)', text)
            if match:
                entities['query'] = match.group(1).strip()
        
        return entities

    def _extract_date(self, text: str) -> Optional[str]:
        """Extract date from command text."""
        # Handle relative dates
        if 'today' in text:
            return datetime.now().date().isoformat()
        elif 'tomorrow' in text:
            return (datetime.now() + timedelta(days=1)).date().isoformat()
        elif 'next week' in text or 'in a week' in text:
            return (datetime.now() + timedelta(weeks=1)).date().isoformat()
        
        # Handle specific dates (MM/DD or DD/MM)
        date_match = re.search(r'([0-9]{1,2})[/-]([0-9]{1,2})', text)
        if date_match:
            month, day = date_match.groups()
            year = datetime.now().year
            try:
                date_obj = datetime(year, int(month), int(day))
                return date_obj.date().isoformat()
            except ValueError:
                pass
        
        return None

    def is_valid_command(self, text: str) -> bool:
        """Check if text contains a valid command."""
        command_type = self._detect_command_type(text.lower())
        return command_type != CommandType.UNKNOWN
