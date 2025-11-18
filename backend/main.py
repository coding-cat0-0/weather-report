from fastapi import FastAPI, status
from sqlmodel import SQLModel
from database.db import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import openai

load_dotenv()
app = FastAPI()

# CORS middleware (must be before include_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify: ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Extract error messages only
    errors = [err['msg'] for err in exc.errors()] # exc.errors is a method in Request validation error class that provides error details
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": ", ".join(errors)},
    )
#  Include routers
#app.include_router(login_route.router)


#  Create tables on startup
@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)