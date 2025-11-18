from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship
from pydantic import field_validator 
import re
from typing import Optional, List


class UserInput(SQLModel):
    name : str
    email : str
    password : str
    @field_validator('email')
    def email_must_be_valid(cls, v):    
        if not re.search(r"\w+@(\w+\.)?\w+\.(com)$",v, re.IGNORECASE):
            raise ValueError("Invalid email format")
        else:
            return v
    @field_validator('password')    
    def password_must_be_strong(cls, p):
             if not re.search(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^_-])[A-Za-z\d!@#$%^&_*-]{8,}$",p):
                 raise ValueError("Invalid Password")
             else:
                    return p   

class Users(SQLModel, table = True):                
            
      id : int = Field(default = None,primary_key = True) 
      name : str = Field(default = None, nullable = False)   
      role : str = Field(default = 'user', nullable = False )
      email : str = Field(default=None, nullable = False)
      password : str = Field(default = None, nullable = False)    