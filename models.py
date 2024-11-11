from database import Base  # Remove the dot
from sqlalchemy import Column, Integer, String

class AudioTranscript(Base):
    __tablename__ = "audio_transcripts"

    id = Column(Integer, primary_key=True, index=True)
    audio_filename = Column(String)
    transcript = Column(String)