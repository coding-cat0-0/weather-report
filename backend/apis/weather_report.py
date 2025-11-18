from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models.schemas_models import UserInput, Users
from database.db import get_session
from auth.jwt_hashing import get_current_user
import openai
import httpx
import os

router = APIRouter()

API_KEY = os.getenv('OPW_KEY')

@router.get('/weather_report')
async def report(lat : float, long : float,
           current_user = Depends(get_current_user(required_role='user')),
           session : Session = Depends(get_session)):
    
    current = await get_weather_report(lat, long)    
    weather_report = parse_current_weather(current)

    return {"Weather Report" : weather_report}


@router.get('/get_disasters')
async def get_disasters(current_user = Depends(get_current_user(required_role='user')),
           session : Session = Depends(get_session)):

        dis = await get_global_report()
        earth = await get_earthquakes()

        disasters = [parse_nasa_event(event) for event in dis['events']]
        earthquake = [parse_usgs(feature) for feature in earth['features']]

        return {"Earthquakes" : earthquake[:20],
                "Disasters" : disasters[:20]
                }
 
    
# Calling external API's
async def get_weather_report(lat : float, long : float):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&appid={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return  response.json()

async def get_global_report():
    url = "https://eonet.gsfc.nasa.gov/api/v3/events"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def get_earthquakes():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()
       
# Formatting of dicts 
def parse_usgs(feature):
    props = feature["properties"]
    geometry = feature["geometry"]

    return {
        "magnitude": props["mag"],
        "location": props["place"],
        "time": props["time"],
        "alert": props.get("alert"),
        "tsunami": props.get("tsunami"),
        "coordinates": geometry["coordinates"]
    }

def parse_nasa_event(event):
    return {
        "id": event["id"],
        "title": event["title"],
        "category": event["categories"][0]["title"],
        "coordinates": event["geometry"][0]["coordinates"],
        "date": event["geometry"][0]["date"]
    }
     
def parse_current_weather(data):
    current = data["current"]

    return {
        "temperature": current["temp"],
        "feels_like": current["feels_like"],
        "humidity": current["humidity"],
        "wind_speed": current["wind_speed"],
        "clouds": current["clouds"],
        "uvi": current.get("uvi"),
        "description": current["weather"][0]["description"],
        "main": current["weather"][0]["main"],
        "icon": current["weather"][0]["icon"],
        "lat": data["lat"],
        "lon": data["lon"],
        "timezone": data["timezone"]
    }     
    
    
        