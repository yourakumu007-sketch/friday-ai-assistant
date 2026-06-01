"""FRIDAY Backend - Main Application Entry Point"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base
from app.routers import auth, tasks, reminders, memory, chat, health
from app.utils.logger import setup_logger

# Setup logging
logger = setup_logger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("FRIDAY Backend Starting...")
    logger.info(f"Environment: {settings.FASTAPI_ENV}")
    logger.info(f"Database: {settings.DATABASE_URL}")
    yield
    # Shutdown
    logger.info("FRIDAY Backend Shutting Down...")


# Create FastAPI app
app = FastAPI(
    title="FRIDAY AI Assistant",
    description="Production-ready AI Personal Assistant API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)


# Health Check Endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "FRIDAY Backend",
            "version": "1.0.0",
        },
    )


# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return JSONResponse(
        status_code=200,
        content={
            "name": "FRIDAY AI Assistant",
            "version": "1.0.0",
            "docs": "/docs",
            "redoc": "/redoc",
            "api_version": "/api/v1",
        },
    )


# Include API routers
api_prefix = "/api/v1"

app.include_router(auth.router, prefix=api_prefix, tags=["Authentication"])
app.include_router(tasks.router, prefix=api_prefix, tags=["Tasks"])
app.include_router(reminders.router, prefix=api_prefix, tags=["Reminders"])
app.include_router(memory.router, prefix=api_prefix, tags=["Memory"])
app.include_router(chat.router, prefix=api_prefix, tags=["Chat"])
app.include_router(health.router, prefix=api_prefix, tags=["Health"])


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting FRIDAY Backend Server...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.FASTAPI_ENV == "development",
        log_level="info",
    )
