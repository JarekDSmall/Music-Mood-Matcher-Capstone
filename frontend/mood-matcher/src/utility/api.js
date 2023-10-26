import axios from 'axios';

const API_URL = "http://localhost:5000";  // Your backend API URL

export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
