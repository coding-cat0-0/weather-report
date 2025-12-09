from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models.schemas_models import UserInput, Users
from database.db import get_session
from auth.jwt_hashing import hash_password, check_hashed_password, create_access_token

router = APIRouter()

@router.post('/signup')
def signup(
    user : UserInput, session : Session = Depends(get_session)):
    user.name = user.name.strip()
    user.email = user.email.strip()
    user.password = user.password.strip()
    query = session.exec(select(Users).where(Users.email == user.email)).first()
    if query:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail = "Email already registered")
    
    try:
        hashed_password = hash_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(e))
    
    create = Users(
        name = user.name,
        email = user.email,
        password = hashed_password
    )    
    
    session.add(create)
    session.commit()
    session.refresh(create)
    return {"message" : "User created"}

@router.post('/signin')
def signin(
    email : str = Body(...), password : str = Body(...), session : Session = Depends(get_session)
):
    query = session.exec(select(Users).where(Users.email == email)).first()
    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail = "Wrong email"
                    )
        
    if not check_hashed_password(password, query.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail = "Invalid password") 
  
    access_token = create_access_token(data = {'sub' : query.email,
                                    'id' : query.id, 'role' : query.role})
    
    return {'message':'Login succesful','access_token' : access_token, 'token_type' : 'bearer'}    
