from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models.schemas_models import UserInput, Users
from database.db import get_session
from auth.jwt_hashing import get_current_user
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.post('/chatbox')
async def ai_chatbox(
    message : str=Body(...),
    current_user = Depends(get_current_user(required_role='user')),
    session:Session=Depends(get_session)):
    print("KEY:", os.getenv("GROQ_API_KEY"))
    
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    res =client.chat.completions.create(
        model = "openai/gpt-oss-20b",
        messages =[
            {"role": 'user', 'content' : message}
        ]
    )        
    return {"reply": res.choices[0].message.content}

