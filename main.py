from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import models
import database
import shutil
import os
from typing import List
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)
print("Database tables created successfully!")

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class SaveResponse(BaseModel):
    status: str
    message: str
@app.post("/save")
async def save_audio_transcript(
    audio: UploadFile,
    transcript: str = Form(...),
    db: Session = Depends(database.get_db)
):
    try:
        # Validate file type
        if not audio.filename.endswith(('.mp3', '.wav', '.m4a')):
            raise HTTPException(status_code=400, detail="Invalid audio file format")

        # Save audio file
        file_location = f"{UPLOAD_DIR}/{audio.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(audio.file, file_object)
        
        # Save to database
        db_record = models.AudioTranscript(
            audio_filename=audio.filename,
            transcript=transcript
        )
        db.add(db_record)
        db.commit()
        
        return {
            "status": "success",
            "message": "Recording saved successfully"
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "API is working"}

