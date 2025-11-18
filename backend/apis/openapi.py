from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models.schemas_models import UserInput, Users
from database.db import get_session
from auth.jwt_hashing import get_current_user
import os
from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(
    tags='AI'
)

@router.post('/chatbox')
async def ai_chatbox(
    message : str=Body(...),
    current_user = Depends(get_current_user(required_role='user')),
    session:Session=Depends(get_session)):
    
    res =client.chat.completion.create(
        model = "gpt-5",
        messages =[
            {"role": 'user', 'content' : message}
        ]
    )        
    return {"reply" : res.choice[0].message["content"]}

