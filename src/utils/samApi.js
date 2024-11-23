import axios from 'axios';

export async function getEntity(uei) {
  const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;
  const url = "https://api.sam.gov/entity-information/v3/entities?" + api_key +
  `&ueiSAM=${uei}`;
  
  try {
    let response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    let data = response.data.entityData[0];
    return data;
  } catch (error) {
    console.error('Error fetching entity:', error);
    throw error;
  }
}