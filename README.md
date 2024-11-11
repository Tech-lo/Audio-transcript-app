# Audio-transcript-app

A web application that allows users to record audio, play it back, and manually transcribe the content. The application features audio recording, playback, text transcription, and persistent storage of audio files with their transcriptions.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [How to Run the Project](#how-to-run-the-project)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database](#database)

## Project Overview

This project includes:
- **Backend**: A REST API built with FastAPI, handling audio data and transcription storage.
- **Frontend**: A React-based interface using Material-UI and Wavesurfer.js for audio recording and playback.

## Project Structure

- **Front-end files**:

public/ - Static files
src/ - Source code
package.json - Frontend dependencies
package-lock.json - Frontend dependency lock file


- **Back-end files**:

main.py - Main server file
models.py - Database models
database.py - Database configuration
requirements.txt - Python dependencies
sql_app.db - SQLite database file

## Technologies Used

- **Backend**: FastAPI, Python, SQLite, SQLAlchemy, Pydantic, Python-Decouple
- **Frontend**: React, Material-UI, Axios, Wavesurfer.js

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Python 3.8+**
- **Node.js 14+** and **npm** (Node Package Manager)
- SQLite

---

## How to Run the Project

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Audio-transcript-app.git

2. **Go to the directory**
   ```bash
   cd Audio-transcript-app

3. Set up a virtual environment (recommended):
   ```bash
   python -m venv venv

4. Activate the virtual environment:
   on Windows
   ```bash
   venv\Scripts\activate
   
5. On Mac/Linux:
   ```bash
   source venv/bin/activate

6. Install dependencies
   ```bash
   pip install -r requirements.txt
   
7. Run the backend server:
   ```bash
   uvicorn main:app --reload

  To install dependencies, you can check in requirements.txt

### Frontend Setup

1. Go to directory
   ```bash
   cd Audio-transcript-app
   
2. Install frontend dependencies
   ```bash
   npm install
The package.json includes dependencies.

3. Run the frontend server:
   ```bash
   npm start

### Accessing the Application
   - Backend: Accessible at http://127.0.0.1:8000 (for API calls).
   - Frontend: Open your browser and navigate to http://localhost:3000.


## Database

1. The application uses an SQLite database (sql_app.db) to store audio and transcription data. Ensure that this file is in the root directory of the project.
2. If you need to reset the database:
   - Delete sql_app.db from the root directory.
   - Run the backend server again to generate a fresh database with the required schema.



   
