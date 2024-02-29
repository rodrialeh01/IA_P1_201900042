import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/'
});

export const analizar = async (fd) => {
    console.log([...fd]);
    const response = await instance.post('/analizar', fd, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}