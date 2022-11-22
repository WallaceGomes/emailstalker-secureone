const axios = require('axios');

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = 'https://graph.microsoft.com/.default';
const grantType = 'password';
const userName = process.env.MAILER_EMAIL;
const password = process.env.MAILER_PASS;

const getMsAccessToken = async () => {
	const response = await axios.post(
		`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
		`grant_type=${grantType}&scope=${scope}&client_id=${clientId}&client_secret=${clientSecret}&username=${userName}&password=${password}`,
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);
	return response.data.access_token;
};

// const msApiUrl = axios.create({
// 	baseURL: `https://graph.microsoft.com/v1.0/me`,
// 	headers: {
// 		Authorization: `Bearer ${getMsAccessToken()}`,
// 	},
// });

export default getMsAccessToken;
