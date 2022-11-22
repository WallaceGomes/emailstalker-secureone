const axios = require('axios');
const msApi = require('./msApi');

const tenantId = process.env.MS_TENANT_ID;
const clientId = process.env.MS_CLIENT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const scope = 'https://graph.microsoft.com/.default';
const grantType = 'password';
const userName = process.env.MAILER_EMAIL;
const password = process.env.MAILER_PASS;

const getMsAccessToken = async () => {
	const data = {
		grant_type: grantType,
		scope: scope,
		client_id: clientId,
		client_secret: clientSecret,
		username: userName,
		password: password,
	};

	const response = await axios.post(
		`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
		new URLSearchParams(data),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	/*
	This is the response.data object:
	{
		token_type: 'Bearer',
		scope: 'https://graph.microsoft.com/.default ...',
		expires_in: 4600,
		ext_expires_in: 4600,
		access_token: 'adwdwd'
	}
	*/

	return response.data;
};

const signIn = async () => {
	const checkMsLastLogin = msApi.defaults.headers.common['Last-Login'];

	if (checkMsLastLogin) {
		const msLastLogin = new Date(checkMsLastLogin);
		const msLastLoginPlusOneHour = new Date(msLastLogin.getTime() + 3600000);
		const now = new Date();

		if (msLastLoginPlusOneHour > now) {
			console.log(
				`Last login was less than one hour ago. No need to login again. Last login: ${msLastLogin}`,
			);
			return;
		}
	}

	console.log(
		`Last login was more than one hour ago. Logging in again. Last login: ${msApi.defaults.headers.common['Last-Login']}`,
	);

	const msAccessToken = await getMsAccessToken();

	msApi.defaults.headers.common[
		'Authorization'
	] = `Bearer ${msAccessToken.access_token}`;
	msApi.defaults.headers.common['Last-Login'] = new Date();

	return;
};

module.exports = signIn;
