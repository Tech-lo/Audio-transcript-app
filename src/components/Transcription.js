import React from 'react';
import { Box, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';

function Transcription({ transcription, setTranscription, onSubmit }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                width: '500px',
                maxWidth: '90%',
                height: '400px',  
                marginTop: '50px',  
                marginRight: 'auto',
            }}
        >
            <Typography variant='h6' sx={{ mb: 1 }}>
                Transcript
            </Typography>
            <form 
                onSubmit={handleSubmit} 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    width: '100%',
                    height: 'calc(100% - 32px)',
                }}
            >
                <textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    placeholder="Transcribe the audio here"
                    style={{
                        width: '100%',
                        height: 'calc(100% - 64px)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        backgroundColor: '#fff',
                        resize: 'none',
                        marginBottom: '12px',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    endIcon={<SendIcon />}
                    sx={{
                        backgroundColor: '#9DC69D !important', // Lighter green to match image
                        height: '40px',
                        boxShadow: 'none',
                        textTransform: 'uppercase',
                        fontWeight: 'normal',
                        '&:hover': {
                            backgroundColor: '#8AB68A !important',
                            boxShadow: 'none',
                        },
                        '&:disabled': {
                            backgroundColor: '#a5d6a7 !important',
                        }
                    }}
                    disabled={!transcription.trim()}
                >
                    Submit 
                </Button>
            </form>
        </Box>
    );
}

export default Transcription;