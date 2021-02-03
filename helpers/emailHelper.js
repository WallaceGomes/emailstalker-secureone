const imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');
const User = require('../models/User');

const emailSender = async (
	appliance,
	destination,
	source,
	ruleId,
	policy,
	time,
) => {
	let user;

	try {
		user = await User.findOne({ where: { name: appliance } });
		if (!user) {
			console.log(`The user ${appliance} doesnt have an email`);
			return;
		}
	} catch (err) {
		console.log(err);
	}

	const transport = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_PASS,
		},
	});
	//

	transport
		.sendMail({
			from: process.env.MAILER_EMAIL,
			to: `${user.email}`,
			subject: 'Alerta de segurança WatchGuard',
			html: `<body style="max-width: 720px; margin: 0 auto;">
			<p style="width: 100%; color: red; text-align: center; font-weight: bold; font-size: 24px;">Alerta de segurança WatchGuard!</p>
			<p style="font-size: 18px;">Tentativa de ataque bloqueada.</p><br/><br/>
			<p style="font-size: 18px;">Local: ${appliance}</p>
			<p style="font-size: 18px;">Origen: ${source}</p>
			<p style="font-size: 18px;">Destino: ${destination}</p>
			<p style="font-size: 18px;">ID da ameaça: ${ruleId}</p>
			<p style="font-size: 18px;">Hora: ${time}</p>
			<p style="font-size: 18px;">Política: ${policy}</p><br/><br/>
			<p>Para mais informações desta ameaça: <a href="https://securityportal.watchguard.com/Threats/Detail?ruleId=${ruleId}">clique aqui</a><p/>

		</body>`,
		})
		.then(() => {
			console.log(`Email delivered to client ${user.email}`);
		})
		.catch((err) => {
			console.log('Errors occurred, failed to deliver the email');

			if (err.response && err.response.body && err.response.body.errors) {
				err.response.body.errors.forEach((error) =>
					console.log('%s: %s', error.field, error.message),
				);
			} else {
				console.log(err);
			}
		});
};

const emailStalker = async () => {
	console.log('Stalker Running');

	const config = {
		imap: {
			user: process.env.MAILER_EMAIL,
			password: process.env.MAILER_PASS,
			host: 'imap.gmail.com',
			port: 993,
			tls: true,
			tlsOptions: { rejectUnauthorized: false },
			authTimeout: 3000,
		},
	};

	await imaps.connect(config).then(function (connection) {
		connection.openBox('INBOX').then(function () {
			let searchCriteria = ['UNSEEN'];
			let fetchOptions = {
				bodies: ['HEADER', 'TEXT', ''],
				markSeen: true,
			};
			connection
				.search(searchCriteria, fetchOptions)
				.then(function (messages) {
					messages.forEach(function (item) {
						let all = _.find(item.parts, { which: '' });
						var id = item.attributes.uid;
						var idHeader = 'Imap-Id: ' + id + '\r\n';
						simpleParser(idHeader + all.body, (err, mail) => {
							const message = mail.html;
							console.log('Email fetched');
							const auxAppliance = message.split('PS Appliance: ', 2);
							const appliance = auxAppliance[1].split('<', 1)[0];

							const auxDestination = message.split('Destination IP: ', 2);
							const destination = auxDestination[1].split('<', 1)[0];

							const auxSource = message.split('Source IP: ', 2);
							const source = auxSource[1].split('<', 1)[0];

							const auxRuleID = message.split('Rule ID: ', 2);
							const ruleId = auxRuleID[1].split('<', 1)[0];

							const auxPolicy = message.split('Policy Name: ', 2);
							const policy = auxPolicy[1].split('<', 1)[0];

							const auxTime = message.split('Time: ', 2);
							const time = auxTime[1].split('<', 1)[0];

							console.log(appliance);
							console.log(destination);
							console.log(source);
							console.log(ruleId);
							console.log(policy);
							console.log(time);

							emailSender(appliance, destination, source, ruleId, policy, time);

							console.log('Stalker Finished');
						});
					});
				})
				.catch((err) => {
					console.log(err);
				});
		});

		connection.end();
	});

	// PS Appliance: Dimen
	// Time: Tue Feb 02 09:14:39 2021 (-03)
	// Process: bw_driver
	// Message: IPS match
	// Protocol: 6
	// Source IP: 104.152.52.25
	// Source Port: 47144
	// Destination IP: 186.231.88.30
	// Destination Port: 80
	// Rule ID: 1134209
	// Action: drop
	// Policy Name: Nat_Entrada_Pacs-00
};

module.exports = { emailStalker };
