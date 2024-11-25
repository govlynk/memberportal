import axios from "axios";

const sanitizeData = (data) => {
	if (!data) return null;

	// Convert data to plain object, removing any Symbol or non-serializable content
	return JSON.parse(JSON.stringify(data));
};

export async function getOpportunity(NAICS) {
	const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;

	// Define search parameters
	const limit = 10; // Replace with your actual limit
	const ptype = "p,o,k"; // Replace with your actual ptype
	// Check if NAICS is an array and has more than one item
	const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;

	const date = new Date();
	const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	const startDate = `${date.getMonth() - 1}/01/${date.getFullYear()}`;

	const apiUrl =
		"https://api.sam.gov/opportunities/v2/search?" +
		api_key +
		`&postedFrom=${startDate}` +
		`&postedTo=${endDate}` +
		`&limit=${limit}` +
		`&ptype=${ptype}` +
		`&naics=${ncode}`;

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
