import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40838413-487c32a1982a33454d1384abb';

export async function getPhotos(userInput, page, per_page) {
  const param = new URLSearchParams({
    key: API_KEY,
    q: userInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: per_page,
  });
  const res = await axios.get(`${BASE_URL}?${param}`);
  console.log(res.data);
  return res.data;
}
