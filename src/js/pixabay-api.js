import axios from 'axios';

const API_KEY = '55158990-7244be83249386c7e2b523135';

const pixabayApi = axios.create({
	baseURL: 'https://pixabay.com/api/',
});

export async function getImagesByQuery(query, page) {
	const response = await pixabayApi.get('', {
		params: {
			key: API_KEY,
			q: query,
			page,
			per_page: 15,
			image_type: 'photo',
			orientation: 'horizontal',
			safesearch: true,
		},
	});

	return response.data;
}
