import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const saveAudioTranscript = async (audioFile, transcript) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('transcript', transcript);
    const response = await api.post('/save', formData);
    return response.data;
};

export const getRecordings = async () => {
    const response = await api.get('/recordings');
    return response.data;
};

export const getAudioUrl = (filename) => {
    return `${api.defaults.baseURL}/audio/${filename}`;
};

export const deleteRecording = async (recordingId) => {
    const response = await api.delete(`/recording/${recordingId}`);
    return response.data;
};

export default api;