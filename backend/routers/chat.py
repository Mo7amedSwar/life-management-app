from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from .. import models, schemas
from ..database import get_db
import httpx, os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"

SYSTEM_PROMPT = """أنت مساعد شخصي متخصص في التعلم والإنتاجية لطالب مصري يدرس DevOps وAI/ML وMLOps وCloud بجانب الكلية.
خطته: Phase 0 (أساس) → Phase 1 (Linux+Python+Git) → Phase 2 (Cloud+Docker+K8s → Job-Ready) → Phase 3 (AI/ML+MLOps) → Phase 4 (CI/CD+IaC) → Phase 5 (Senior AI Platform Engineer).
رد باللغة العربية مع المصطلحات الإنجليزية التقنية. كن محدداً وعملياً وشجعه."""


@router.post("/", response_model=schemas.ChatMessage)
async def send_chat(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    """Send a message and get an AI response via Gemini."""
    api_key = GEMINI_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GEMINI_API_KEY not configured. Add it to backend/.env"
        )

    # Fetch recent history (last 10 messages for context)
    history = db.query(models.ChatMessage).order_by(
        models.ChatMessage.id.desc()
    ).limit(10).all()
    history.reverse()

    contents = [
        {"role": msg.role, "parts": [{"text": msg.content}]}
        for msg in history
    ]
    contents.append({"role": "user", "parts": [{"text": request.message}]})

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{GEMINI_URL}?key={api_key}",
                json={
                    "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                    "contents": contents,
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
                }
            )
        data = resp.json()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"]["message"])
        reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Gemini API timeout")

    # Persist both messages
    from datetime import datetime
    ts = datetime.now().strftime("%H:%M")
    for role, content in [("user", request.message), ("model", reply_text)]:
        db.add(models.ChatMessage(role=role, content=content, timestamp=ts))
    db.commit()

    # Return the model reply
    msg = db.query(models.ChatMessage).order_by(models.ChatMessage.id.desc()).first()
    return msg


@router.get("/history")
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.ChatMessage).order_by(models.ChatMessage.id.desc()).limit(limit).all()


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(db: Session = Depends(get_db)):
    db.query(models.ChatMessage).delete()
    db.commit()
