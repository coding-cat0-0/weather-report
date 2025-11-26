from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models.schemas_models import UserInput, Users
from database.db import get_session
from auth.jwt_hashing import get_current_user
from groq import Groq
import httpx
import os
from typing import Optional
import json
from redis_client import redis
import asyncio
router = APIRouter()

API_KEY = os.getenv('OPW_KEY')
from redis_client import redis


@router.get('/weather_report')
async def report(lat : float, long : float,
           current_user = Depends(get_current_user(required_role='user')),
           session : Session = Depends(get_session)):
    
    current = await get_weather_report(lat, long)    
    weather_report = parse_current_weather(current)
    summarise = await get_ai_summary(weather_report)

    return {"Weather Report" : weather_report,
            "Summary" : summarise
            }



@router.get('/get_disasters')
async def get_disasters(
    current_user = Depends(get_current_user(required_role='user')),
    session: Session = Depends(get_session)
):
    
    # Run cached calls in parallel
    earth, dis = await asyncio.gather(
        get_cached_earthquakes(),
        get_cached_disasters()
    )

    disasters = [parse_nasa_event(event) for event in dis['events']]
    earthquake = [parse_usgs(feature) for feature in earth['features']]

    summary_input = {
        "earthquakes": earthquake[:5],
        "disasters": disasters[:5]
    }

    summarise = await get_ai_summary(summary_input)

    return {
        "Earthquakes": earthquake,
        "Disasters": disasters,
        "Summary": summarise
    }

# @router.get('/get_disasters')
# async def get_disasters(current_user = Depends(get_current_user(required_role='user')),
#            session : Session = Depends(get_session)):

#         earth_task = get_earthquakes()
#         dis_task = get_global_report()

#         earth, dis = await asyncio.gather(earth_task, dis_task)
#         disasters = [parse_nasa_event(event) for event in dis['events']]
#         earthquake = [parse_usgs(feature) for feature in earth['features']]
#         summary_input = {
#         "earthquakes": earthquake[:5],
#         "disasters": disasters[:5]
#          }
#         summarise = await get_ai_summary(summary_input)

#         # return {"Earthquakes" : earthquake[:20],
#         #         "Disasters" : disasters[:20],
#         return {
#             "Earthquakes" : earthquake,
#                 "Disasters" : disasters,
#                 "Summary" : summarise
#                 }
 
    
# Calling external API's
async def get_weather_report(lat : float, long : float):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&appid={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return  response.json()

async def get_global_report():
    #timeout = httpx.Timeout(connect=10, read=60)
    url = "https://eonet.gsfc.nasa.gov/api/v3/events"
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        return response.json()

async def get_earthquakes():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    async with httpx.AsyncClient(timeout=30.0) as client:
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

    return {
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "clouds": data["clouds"]["all"],
        "description": data["weather"][0]["description"],
        "main": data["weather"][0]["main"],
        "icon": data["weather"][0]["icon"],
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
        "timezone": data["timezone"],
        "city": data["name"]
    }
    
    
# Open AI summary
async def get_ai_summary(weather : Optional[str]=None,     disaster : Optional[str] = None
    ,earthquakes : Optional[str] = None):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    data = {
        "weather" : weather,
        "disaster" : disaster,
        "earthquakes" : earthquakes
        }
    filtered_data = {k:v for k, v in data.items() if v is not None}
    
    prompt = "Summarise the following data into simple words short yet detailed report : "
    for key, value in filtered_data.items():
        prompt += f"{key.capitalize()} : {value}"
        
    res = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages = [
            {'role':'system', 'content' : 'You are an AI that summarizes weather, disaster, and earthquake data and create a short yet detailed report'},
            {'role':'user', 'content' : prompt}
            ]
    )
    
    return {"reply": res.choices[0].message.content}

CACHE_TTL = 60  # 1 minute

async def get_cached_earthquakes():
    cached = await redis.get("earthquakes_cache")
    if cached:
        return json.loads(cached)

    # Not cached → Fetch fresh
    earth = await get_earthquakes()
    await redis.set("earthquakes_cache", json.dumps(earth), ex=CACHE_TTL)
    return earth


async def get_cached_disasters():
    cached = await redis.get("disasters_cache")
    if cached:
        return json.loads(cached)

    dis = await get_global_report()
    await redis.set("disasters_cache", json.dumps(dis), ex=CACHE_TTL)
    return dis