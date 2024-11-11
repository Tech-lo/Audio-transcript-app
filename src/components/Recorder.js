import React, { useState, useRef, useEffect } from 'react';
import { Mic, Stop, Replay, Repeat, Shuffle } from '@mui/icons-material';
import { IconButton, Box, Slider } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';
import Typography from '@mui/material/Typography';

function Recorder({ setAudio, handleReset, forceReset }) {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const waveformRef = useRef(null);
    const waveformContainerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    useEffect(() => {
        if (waveformContainerRef.current && !waveformRef.current) {
            waveformRef.current = WaveSurfer.create({
                container: waveformContainerRef.current,
                waveColor: '#4caf50',
                progressColor: '#ff5722',
                height: 50,
                cursorWidth: 1,
                cursorColor: '#333',
                barWidth: 2,
                barGap: 1,
                responsive: true,
                normalize: true,
                plugins: [
                    MicrophonePlugin.create()
                ]
            });
        }

        return () => {
            if (waveformRef.current) {
                waveformRef.current.destroy();
                waveformRef.current = null;
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, []);
    
    useEffect(() => {
        if (forceReset) {
            onReset();
        }
    }, [forceReset])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => {
                if (isRepeat) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                } else {
                    setIsPlaying(false);
                }
            };
        }
    }, [isRepeat]);

    const handleShuffle = () => {
        setIsShuffle(!isShuffle);
        // Note: Since this is a single audio file recorder,
        // shuffle doesn't have a practical effect, but the UI is implemented
    };

    const handleRepeat = () => {
        setIsRepeat(!isRepeat);
        if (audioRef.current) {
            audioRef.current.loop = !isRepeat;
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                
                // Update the parent component with both blob and URL
                setAudio({
                    blob: audioBlob,
                    url: url
                });
                
                setAudioUrl(url);

                if (waveformRef.current) {
                    waveformRef.current.destroy();
                }

                waveformRef.current = WaveSurfer.create({
                    container: waveformContainerRef.current,
                    waveColor: '#4caf50',
                    progressColor: '#ff5722',
                    height: 50,
                    cursorWidth: 1,
                    cursorColor: '#333',
                    barWidth: 2,
                    barGap: 1,
                    responsive: true,
                    normalize: true
                });

                await waveformRef.current.load(url);
                
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            if (waveformRef.current) {
                waveformRef.current.microphone.start();
            }
            setRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            if (waveformRef.current && waveformRef.current.microphone) {
                waveformRef.current.microphone.stop();
            }
            setRecording(false);
        }
    };

    const handleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const onReset = () => {
        setRecording(false);
        setAudioUrl(null);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        
        if (waveformRef.current) {
            waveformRef.current.stop();
            waveformRef.current.empty();
        }

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        if (audioRef.current) {
            audioRef.current.src = '';
        }

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }
        chunksRef.current = [];
        
        setAudio(null);

        handleReset?.();
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSliderChange = (_, newValue) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newValue;
            setCurrentTime(newValue);
        }
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
                position: 'relative',
                marginTop: '50px',
                marginLeft: 'auto',
            }}
        >
            <Typography variant='h6' sx={{ mb: 1 }}>
                Recording
            </Typography>
            <Box sx={{ width: '100%', height: '50px', mb: 2 }}>
                <div 
                    ref={waveformContainerRef} 
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>

            {audioUrl && !recording && (
                <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2, 
                    position: 'relative',
                    zIndex: 1 
                    }}
                    >
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        style={{ display: 'none' }}
                    />
                                        <IconButton
                            onClick={handleShuffle}
                            sx={{
                                padding: 1,
                                color: isShuffle ? '#4caf50' : 'inherit',
                            }}
                        >
                            <Shuffle />
                        </IconButton>
                    <IconButton 
                        onClick={() => {
                            if (audioRef.current) {
                                if (audioRef.current.paused) {
                                    audioRef.current.play();
                                    setIsPlaying(true);
                                } else {
                                    audioRef.current.pause();
                                    setIsPlaying(false);
                                }
                            }
                        }}
                        sx={{ padding: 1 }}
                    >
                        {isPlaying ? <Stop /> : <Mic />}
                    </IconButton>
                    <Box sx={{ flex: 1, mx: 2 }}>
                        <Slider
                            size="small"
                            value={currentTime}
                            max={duration}
                            onChange={handleSliderChange}
                            aria-label="Time"
                        />
                    </Box>
                    <Box sx={{ minWidth: 60, textAlign: 'right' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Box>
                    <IconButton
                            onClick={handleRepeat}
                            sx={{
                                padding: 1,
                                color: isRepeat ? '#4caf50' : 'inherit',
                            }}
                        >
                            <Repeat />
                        </IconButton>
                </Box>
                
            )}

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                }}>
                <IconButton 
                    onClick={handleRecording}
                    sx={{
                        color: recording ? '#e53935' : '#4caf50',
                        backgroundColor: recording ? '#ffebee' : '#e8f5e9',
                        borderRadius: '50%',
                        width: '64px',
                        height: '64px',
                        '&:hover': {
                            backgroundColor: recording ? '#ffcdd2' : '#c8e6c9',
                        },
                    }}
                >
                    {recording ? <Stop fontSize="large" /> : <Mic fontSize="large" />}
                </IconButton>
            </Box>
            
            {(recording || audioUrl) && (
                <IconButton 
                    onClick={onReset} 
                    sx={{ 
                        position: 'absolute',
                        bottom: '80px',
                        color: '#f44336',
                        width: '48px',
                        height: '48px',
                    }}
                >
                    <Replay />
                </IconButton>
            )}
        </Box>
    );
}

export default Recorder;