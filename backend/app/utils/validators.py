"""FRIDAY Backend - Input Validators"""
import re
from typing import Optional


class Validators:
    """Input validation utilities."""

    @staticmethod
    def validate_username(username: str) -> bool:
        """Validate username format.
        Requirements: 3-50 chars, alphanumeric + underscore/hyphen
        """
        if not username or len(username) < 3 or len(username) > 50:
            return False
        pattern = r"^[a-zA-Z0-9_-]+$"
        return bool(re.match(pattern, username))

    @staticmethod
    def validate_password(password: str) -> tuple[bool, str]:
        """Validate password strength.
        Requirements: At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
        """
        if not password or len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r"[0-9]", password):
            return False, "Password must contain at least one digit"
        
        return True, "Password is valid"

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_language(language: str) -> bool:
        """Validate language code."""
        valid_languages = ["en", "hi", "bn"]  # English, Hindi, Bengali
        return language.lower() in valid_languages

    @staticmethod
    def sanitize_input(input_string: str, max_length: int = 1000) -> str:
        """Sanitize user input."""
        # Remove leading/trailing whitespace
        sanitized = input_string.strip()
        # Limit length
        sanitized = sanitized[:max_length]
        # Remove potentially dangerous characters
        dangerous_chars = ["<", ">", "&", "'", '"']
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")
        return sanitized
