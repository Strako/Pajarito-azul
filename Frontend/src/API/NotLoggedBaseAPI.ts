import axios from 'axios';
export const BASE_URL = "http://127.0.0.1:3000/";

export const NewInstance = axios.create({
	// Configuration
	baseURL: BASE_URL,
	headers: {
		accept: 'application/json'
      },
});

 