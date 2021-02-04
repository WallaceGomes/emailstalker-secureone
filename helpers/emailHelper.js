const imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');
const { getYear, parseISO } = require('date-fns');

const emailSender = async (
	appliance,
	destination,
	source,
	ruleId,
	policy,
	time,
	description,
) => {
	// let user;

	// try {
	// 	user = await User.findOne({ where: { name: appliance } });
	// 	if (!user) {
	// 		console.log(`The user ${appliance} doesnt have an email`);
	// 		return;
	// 	}
	// } catch (err) {
	// 	console.log(err);
	// }

	const transport = nodemailer.createTransport({
		host: 'br530.hostgator.com.br',
		name: 'hostgator.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_PASS,
		},
	});
	//

	transport
		.sendMail({
			from: process.env.MAILER_EMAIL,
			to: `dev@secureone.com.br`,
			subject: 'Alerta de segurança',
			html: `<body
			style="
				max-width: 720px;
				margin-top: 20px;
				margin-left: 10px;
				font-family: 'Calibri', sans-serif;
			"
		>
			<div style="display: flex">
				<img
					style="width: 170px"
					src="https://secureone.com.br/wp-content/uploads/2019/05/secureone-preto.png"
				/>
				<p
					style="
						color: red;
						text-align: center;
						font-weight: bold;
						font-size: 30px;
						margin-left: 50px;
					"
				>
					Alerta de segurança!
				</p>
			</div>
			<br /><br />
			<p>Tentativa de ataque bloqueada.</p>
			<section style="line-height: 5px">
				<p style="font-weight: 600">
					Categoria: <span style="font-weight: 400;">${description}</span>
				</p>
				<p style="font-weight: 600">
					Local: <span style="font-weight: 400; color: orange">${appliance}</span>
				</p>
				<p style="font-weight: 600">
					Origen: <span style="font-weight: 400">${source}</span>
				</p>
				<p style="font-weight: 600">
					Destino: <span style="font-weight: 400">${destination}</span>
				</p>
				<p style="font-weight: 600">
					ID da ameaça:
					<span style="font-weight: 400; color: orange">${ruleId}</span>
				</p>
				<p style="font-weight: 600">
					Hora: <span style="font-weight: 400">${time}</span>
				</p>
				<p style="font-weight: 600">
					Política: <span style="font-weight: 400">${policy}</span>
				</p>
			</section>
			<br />
			<section style="line-height: 5px">
				<p>Para mais informações desta ameaça:</p>
				<p>
					<a
						href="https://securityportal.watchguard.com/Threats/Detail?ruleId=${ruleId}"
						>https://securityportal.watchguard.com/Threats/Detail?ruleId=${ruleId}</a
					>
				</p>
			</section>
		</body>
		`,
		})
		.then(() => {
			console.log(`Email delivered to client`);
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
			host: 'mail.secureoneinfo.com.br',
			port: 993,
			tls: true,
			tlsOptions: { rejectUnauthorized: false },
			authTimeout: 3000,
		},
	};

	await imaps.connect(config).then(function (connection) {
		return connection.openBox('INBOX').then(function () {
			let searchCriteria = ['UNSEEN', ['SUBJECT', 'IPS']];
			let fetchOptions = {
				bodies: ['HEADER', 'TEXT', ''],
				markSeen: true,
			};
			return connection
				.search(searchCriteria, fetchOptions)
				.then(function (messages) {
					messages.forEach(function (item) {
						let all = _.find(item.parts, { which: '' });
						var id = item.attributes.uid;
						var idHeader = 'Imap-Id: ' + id + '\r\n';
						simpleParser(idHeader + all.body, (err, mail) => {
							const message = mail.html;

							console.log('Email fetched');
							// console.log(message);
							const auxAppliance = message.split('Appliance: ', 2);
							const appliance = auxAppliance[1].split('<', 1)[0];

							const auxDestination = message.split('Destination IP: ', 2);
							const destination = auxDestination[1].split('Destination', 1)[0];

							const auxSource = message.split('Source IP: ', 2);
							const source = auxSource[1].split('Source', 1)[0];

							const auxRuleID = message.split('Rule ID: ', 2);
							const ruleId = auxRuleID[1].split(',', 1)[0];

							const auxPolicy = message.split('Policy Name: ', 2);
							const policy = auxPolicy[1].split('<', 1)[0];

							const auxDescription = message.split('Message: ', 2);
							let description = auxDescription[1].split(',', 1)[0];

							if (description.includes('IPS')) {
								description = 'Intrusion Prevention Service';
							}

							const auxTime = message.split('Time: ', 2);
							const time = auxTime[1].split('(', 1)[0];
							const dateArray = time.split(' ');

							let dayOfTheWeek;
							let month;

							switch (dateArray[0]) {
								case 'Sun':
									dayOfTheWeek = 'Dom';
									break;
								case 'Mon':
									dayOfTheWeek = 'Seg';
									break;
								case 'Tue':
									dayOfTheWeek = 'Ter';
									break;
								case 'Wed':
									dayOfTheWeek = 'Qua';
									break;
								case 'Thu':
									dayOfTheWeek = 'Qui';
									break;
								case 'Fri':
									dayOfTheWeek = 'Sex';
									break;
								default:
									dayOfTheWeek = 'Sab';
							}

							switch (dateArray[1]) {
								case 'Jan':
									month = 'Jan';
									break;
								case 'Feb':
									month = 'Fev';
									break;
								case 'Mar':
									month = 'Mar';
									break;
								case 'Apr':
									month = 'Abr';
									break;
								case 'May':
									month = 'Mai';
									break;
								case 'Jun':
									month = 'Jun';
									break;
								case 'Jul':
									month = 'Jul';
									break;
								case 'Aug':
									month = 'Ago';
									break;
								case 'Sep':
									month = 'Set';
									break;
								case 'Oct':
									month = 'Out';
									break;
								case 'Nov':
									month = 'Nov';
									break;
								default:
									month = 'Dez';
							}

							const timeString = `${dayOfTheWeek} ${month} ${dateArray[2]} ${dateArray[3]} ${dateArray[4]}`;

							console.log(appliance);
							console.log(destination);
							console.log(source);
							console.log(ruleId);
							console.log(policy);
							console.log(timeString);
							console.log(description);

							emailSender(
								appliance,
								destination,
								source,
								ruleId,
								policy,
								timeString,
								description,
							);

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
