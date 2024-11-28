import axios from "axios";

const sanitizeData = (data) => {
	if (!data) return null;

	// Convert data to plain object, removing any Symbol or non-serializable content
	return JSON.parse(JSON.stringify(data));
};

const formatQueryParams = (params) => {
	return Object.entries(params)
		.map(([key, value]) => `${value}`)
		.join("&");
};

export async function getOpportunity(searchParams) {
	const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;

	const queryString = formatQueryParams(searchParams);
	const apiUrl = `https://api.sam.gov/opportunities/v2/search?${api_key}&${queryString}`;
	console.log(apiUrl);

	try {
		const response = await axios.get(apiUrl);
		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}
		// Sanitize the data before returning
		const sanitizedData = sanitizeData(response.data);
		return sanitizedData;
	} catch (error) {
		// Handle errors
		const serializedError = new Error(error.message || "Failed to fetch opportunity data");
		throw serializedError;
	}
}
