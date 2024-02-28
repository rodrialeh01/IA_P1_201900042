import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api'
});

export const analizar = async (form) => {
    const response = await instance.post('/analizar', form,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}