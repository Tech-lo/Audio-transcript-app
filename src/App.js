import React, { useState } from 'react';
import { Box } from '@mui/material';
import Recorder from './components/Recorder';
import Transcription from './components/Transcription';
import axios from './api';

function App() {
    const [audio, setAudio] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [forceReset, setForceReset] = useState(false);

    const handleSubmit = async () => {
        if (!audio?.blob || !transcription) {
            console.log('No audio or transcription to submit');
            return;
        }
      
        const formData = new FormData();
        formData.append('audio', audio.blob, 'recording.wav');
        formData.append('transcript', transcription);
      
        try {
            const response = await axios.post('http://localhost:8000/save', formData);
          
            if (response.data.status === 'success') {
                handleReset();
                setForceReset(prev => !prev);
                alert('Recording saved successfully!');
            }
        } catch (error) {
            console.error('Error saving recording:', error);
            alert('Failed to save recording'); // Optional: error feedback
        }
    };

    const handleReset = () => {
        setAudio(null);
        setTranscription('');
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '20px',
            width: '97%',
        }}>
            <Box sx={{ 
                display: 'flex', 
                gap: '24px', 
                alignItems: 'flex-start'
            }}>
                <Recorder 
                    setAudio={setAudio} 
                    handleReset={handleReset} 
                    forceReset={forceReset}
                />
                <Transcription 
                    transcription={transcription} 
                    setTranscription={setTranscription} 
                    onSubmit={handleSubmit}
                />
            </Box>
        </Box>
    );
}

export default App;