const axios = require('axios');

const msApi = axios.create({
	baseURL: `https://graph.microsoft.com/v1.0/me`,
	// headers: {
	// 	Authorization: `Bearer ${getMsAccessToken()}`,
	// },
});

module.exports = msApi;
