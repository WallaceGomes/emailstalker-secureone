const imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const ipsEmailSender = async (
	appliance,
	destination,
	source,
	ruleId,
	policy,
	time,
	description,
	destinationPort,
	sourcePort,
) => {
	const transport = nodemailer.createTransport({
		host: 'smtp.office365.com',
		name: 'smtp.office365.com',
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
			// to: `notificacao@secureone.com.br,${process.env.MAILER_EMAIL}`,
			to: `wallacecardosogomes@gmail.com`,
			subject: 'Alerta de segurança',
			html: `<body
			style="
				max-width: 720px;
				margin-top: 20px;
				margin-left: 10px;
				font-family: 'Calibri', sans-serif;
			"
			>
			<p
				style="color: red;
				font-weight: bold;
				font-size: 30px";
				line-height: 2px;"
			>
				Alerta de segurança!
			</p>
			<br />
			<p>Sistema de prevenção de intrusão executado.</p>
			<section style="line-height: 2px">
				<p style="font-weight: 600">
					Categoria: <span style="font-weight: 400;">${description}</span>
				</p>
				<p style="font-weight: 600">
					Local: <span style="font-weight: 400; color: orange">${appliance}</span>
				</p>
				<p style="font-weight: 600">
					IP Origem: <span style="font-weight: 400">${source}</span>
				</p>
				<p style="font-weight: 600">
					IP Destino: <span style="font-weight: 400">${destination}</span>
				</p>
				<p style="font-weight: 600">
					Porta Origem: <span style="font-weight: 400">${sourcePort}</span>
				</p>
				<p style="font-weight: 600">
					Porta Destino: <span style="font-weight: 400">${destinationPort}</span>
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
			<section>
				<img
					style="width: 180px"
					src="https://static.wixstatic.com/media/25ae14_9f0b632478c344c8a1a49e1be2e83da8~mv2.png"
				/>
				<p>
					<a
						href="https://secureone.com.br/"
						>www.secureone.com.br</a
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

const aVEmailSender = async (
	appliance,
	destination,
	source,
	policy,
	timeString,
	description,
	reason,
	authUser,
	virus,
	host,
	path,
) => {
	const transport = nodemailer.createTransport({
		host: 'smtp.office365.com',
		name: 'smtp.office365.com',
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
			// to: `notificacao@secureone.com.br,${process.env.MAILER_EMAIL}`,
			to: `wallacecardosogomes@gmail.com`,
			subject: 'Alerta de segurança',
			html: `<body
			style="
				max-width: 720px;
				margin-top: 20px;
				margin-left: 10px;
				font-family: 'Calibri', sans-serif;
			"
		>
			<p style="color: red; font-weight: bold; font-size: 30px; line-height: 2px">
				Alerta de segurança!
			</p>
			<br />
			<p>Proteção de antivírus executada com sucesso.</p>
			<section style="line-height: 2px">
				<p style="font-weight: 600">
					Categoria: <span style="font-weight: 400">${description}</span>
				</p>
				<p style="font-weight: 600">
					Local: <span style="font-weight: 400; color: orange">${appliance}</span>
				</p>
				<p style="font-weight: 600">
					Razão:
					<span style="font-weight: 400"
						><span style="color: red">${reason}</span></span
					>
				</p>
				<p style="font-weight: 600">
					Usuário autenticado:
					<span style="font-weight: 400"
						><span style="color: red">${authUser}</span></span
					>
				</p>
				<p style="font-weight: 600">
					Origen: <span style="font-weight: 400">${source}</span>
				</p>
				<p style="font-weight: 600">
					Destino: <span style="font-weight: 400">${destination}</span>
				</p>
				<p style="font-weight: 600">
					Hora: <span style="font-weight: 400">${timeString}</span>
				</p>
				<p style="font-weight: 600">
					Política: <span style="font-weight: 400">${policy}</span>
				</p>
				<br />
				<section style="line-height: 2px">
					<p style="font-weight: 600">
						Informações do Vírus:</span><p></p>
						<p>Virus: <span style="font-weight: 400; color: red">${virus}</p>
						<p>Host: <span style="font-weight: 400; color: red">${host}</p>
						<p>Path: <span style="font-weight: 400; color: red">${path}</p>
					</p>
				</section>
			</section>
			<br />
			<section>
				<img
					style="width: 180px"
					src="https://static.wixstatic.com/media/25ae14_9f0b632478c344c8a1a49e1be2e83da8~mv2.png"
				/>
				<p>
					<a href="https://secureone.com.br/">www.secureone.com.br</a>
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

const ipsCloudEmailSender = async (
	local,
	destination,
	source,
	ruleId,
	policy,
	dateString,
	destinationPort,
	sourcePort,
) => {
	const transport = nodemailer.createTransport({
		host: 'smtp.office365.com',
		name: 'smtp.office365.com',
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
			// to: `notificacao@secureone.com.br,${process.env.MAILER_EMAIL}`,
			to: `wallacecardosogomes@gmail.com`,
			subject: 'Alerta de segurança',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:13.5pt; margin-right:0cm; margin-left:0cm">
				<span style="color:rgb(243,144,29)">Alerta de segurança!</span>
			</h3>
			<h4 style="color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:12pt; margin-right:0cm; margin-left:0cm">
				<span style="color:#555555">Informação:&nbsp;</span>
			</h4>
			<div>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>Categoria: </b><span style="color:rgb(243,144,29)">Intrusion Prevention Service</span><span
						style="color:rgb(243,144,29)"><b>
						</b></span><b><span style="color:rgb(243,144,29)">&nbsp;</span><br>
						<br>
					</b>
				</p>
				<p style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin-right:0cm; margin-left:0cm">
					<b style="color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt">Local:
					</b><span
						style="color:rgb(243,144,29); font-family:Calibri,sans-serif; font-size:11pt">${local}</span><span
						style="color:rgb(243,144,29); font-family:Calibri,sans-serif; font-size:11pt"><b>
						</b></span><b style="color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt"><span
							style="color:rgb(243,144,29)">&nbsp;</span><br>
					</b><b
						style="color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)">Razão:</b><span style="font-weight:400; background-color:rgb(255,255,255); display:inline!important; color:rgb(243,144,29)"> Tentativa	de Intrusão</span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Ação:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">Proteção	executada com sucesso</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">IP Origem:
					</b><span style="font-family:Calibri,sans-serif; font-size:11pt; color:rgb(85,85,85)">${source}
					</span><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">&nbsp;</b><b><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>IP Destino: </b>${destination} <b>&nbsp;</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>Porta Origem: </b>${sourcePort} <b>&nbsp;</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>Porta Destino: </b>${destinationPort} <b>&nbsp;</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>ID da ameaça: </b><span style="color:rgb(243,144,29)">${ruleId}</span><span style="color:rgb(243,144,29)"><b>
						</b></span><b><span style="color:rgb(243,144,29)">&nbsp;</span><br>
					</b><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">Hora:
					</b><span style="font-family:Calibri,sans-serif; font-size:11pt; color:rgb(85,85,85)">${dateString}</span><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">
						&nbsp;</b><b><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>Política: </b>${policy}<b>&nbsp;</b>
				</p>
				<br>
			</div>
			<div style=""><span style="font-family:Calibri,Helvetica,sans-serif">Para mais informações desta ameaça:</span>
				<div><span style="font-family:Calibri,Helvetica,sans-serif"><a
							href="https://securityportal.watchguard.com/Threats/Detail?ruleId=${ruleId}"
							id="LPlnk677473">https://securityportal.watchguard.com/Threats/Detail?ruleId=${ruleId}</a></span><br>
				</div>
				<div><br>
				</div>
				<div><br>
				</div>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><span
						style="margin:0px; font-size:14.6667px; font-family:Calibri,sans-serif; color:rgb(243,144,29); background-color:rgb(255,255,255)">Intrusion
						Prevention Service</span><span
						style="margin:0px; font-size:14.6
			667px; font-family:Calibri,sans-serif; color:rgb(243,144,29); background-color:rgb(255,255,255)"><b><span>&nbsp;</span>
						</b></span><b
						style="font-family:Calibri,sans-serif; font-size:14.6667px; background-color:rgb(255,255,255)"><span styl
							e="margin:0px; color:rgb(243,144,29)">&nbsp;</span></b></span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555">O Intrusion Prevention Service utiliza assinaturas atualizadas continuamente para varrer
					o
					tráfego na maioria dos protocolos, fornecendo proteção em tempo real contra ameaças, incluindo spyware, injeções
					de
					SQL
					, cross-site scripting
					e buffer overflow.<br>
				</span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><br>
				</span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><br>
				</span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><b>Sistema de monitoramento Secureone</b></span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<br>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><br>
				</span>
			</div>
			<p
				style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:11pt; margin:0cm">
				<br>
			</p>
			<p style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:11pt; margin:0cm; text-align:center; background:rgb(221,221,
			221)">
				<span style="font-size:9.0pt; color:#555555">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA
					<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031 <a
						href="mailto:atendimento@secureone.com.br">
						atendimento@secureone.com.br</a> &nbsp;</span>
			</p>
			<br>
			</div>
			<div style="font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)">
				<br>
			</div>
			<div style="font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)">
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<span style="margin:0px">&nbsp;</span>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<span style="margin:0px"><br>
					</span>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<span style="margin:0px"><br>
					</span>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
		</body>

		`,
		})
		.then(() => {
			console.log(`Email delivered to client ${local}`);
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

const portScamCloudEmailSender = async (
	local,
	destination,
	source,
	dateString,
) => {
	const transport = nodemailer.createTransport({
		host: 'smtp.office365.com',
		name: 'smtp.office365.com',
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
			// to: `notificacao@secureone.com.br,${process.env.MAILER_EMAIL}`,
			to: `wallacecardosogomes@gmail.com`,
			subject: 'Alerta de segurança',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(81,167,249)">Alerta de segurança!</span>
			</h3>
			<h4
				style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif"><b
							style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit">Categoria</b>:
						<spa n style="color:rgb(81,167,249)">&nbsp;
				</span><span style="color:rgb(81,167,249)">Port
					Scan</span><br>
			</div>
			<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
				<div style="margin:0px"><span style="margin:0px; color:rgb(200,38,19)"><br>
					</span></div>
				<div style="margin:0px"><b>Local</b>: <span style="color:rgb(81,167,249)">${local}</span></div>
				<div style="margin:0px"><b>Razão</b>: <span style="color:rgb(81,167,249)"><i>Port Scan Attack</i></span></div>
				<div style="margin:0px"><b
						style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)">Ação:<span>&nbsp;</span>
						</b><span style="font-weight:400; background-color:rgb(255,255,255); display:inline!important">Proteção
							executada com sucesso</span><br>
					</b></div>
				<div style="margin:0px"><b
						style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit">Origem</b>: ${source}<br>
				</div>
				<div style="margin:0px"><b>Destino</b>: ${destination}</div>
				<div style="margin:0px"><b>Hora</b>: ${dateString}</div>
				<div style="margin:0px"><br>
				</div>
				<div style="margin:0px"><br>
				</div>
			</div>
			</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><span
						style="color:rgb(81,167,249); font-family:Calibri,sans-serif; font-size:14.6667px; background-color:rgb(255,255,255); display:inline!important">Port
						Scan</span><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<font style="box-sizing:border-box; color:rgb(0,0,0); font-family:opensans,sans-serif; font-size:14.4px">
						<font style="box-sizing:border-box"><span style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">Os
								invasores frequentemente procuram portas abertas como pontos de partida para lançar ataques à
								rede.</span><span style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></font>
						<font style="box-sizing:border-box">
							<spa n style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">Uma
				</span><span style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></font>
				</font><i style="box-sizing:border-box; color:rgb(0,0,0); font-family:opensans,sans-serif; font-size:14.4px">
					<font style="box-sizing:border-box">
						<font style="box-sizing:border-box"><span
								style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">varredura de porta</span></font>
					</font>
				</i>
				<font style="box-sizing:border-box; color:rgb(0,0,0); font-family:opensans,sans-serif; font-size:14.4px">
					<font style="box-sizing:border-box"><span
							style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span><span
							style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">é o tráfego TCP ou UDP enviado a um intervalo
							de portas.</span><span style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></font>
					<font style="box-sizing:border-box"><span style="font-size:11pt; font-family:Calibri,	Helvetica,sans-serif">Essas
							portas podem ser em sequência ou aleatórias, de 0 a 65535. Uma varredura de IP é o tráfego TCP ou UDP que é
							enviado a um intervalo de endereços de rede.</span><span
							style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span>
					</font>
					<font style="box-sizing:border-box"><span style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">As
							varreduras de portas examinam um computador para encontrar os serviços que ele usa.</span><span
							style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">&nbsp;</span></font>
					<font style="box-sizing:border-box"><span
							style="font-size:11pt; font-family:Calibri,Helvetica,sans-serif">Asvarreduras de endereço IP examinam uma rede
							para ver quais dispositivos estão nessa rede.</span></font>
				</font><br>
				</span>
			</div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<font style="box-sizing:border-box; color:rgb(0,0,0); font-family:opensans,sans-serif; font-size:14.4px">
						<font style="box-sizing:bord
				er-box"><br>
						</font>
					</font>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><b><span
							style="margin:0px"><span style="margin:0px">Sistema de monitoramento Secureone</span></span><br>
					</b><span style="margin:0px"></span><br>
				</span></div>
			<p class="x_x_MsoNormal" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color
				:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
				<br>
			</p>
			<p class="x_x_MsoNormal" align="center"
				style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span
						style="margin:0px">&nbsp;</span><a href="mailto:atendimento@secureone.com.br"
						style="margin:0px">atendimento@secureone.com.br</a><span style="margin:0px">
						&nbsp;</span>&nbsp;</span>
			</p>
			<br>
		</body>
		`,
		})
		.then(() => {
			console.log(`Email delivered to client ${local}`);
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

const parseIPSEmails = async (message) => {
	const auxAppliance = message.split('Appliance: ', 2);
	const appliance = auxAppliance[1].split('\n', 1)[0];

	const auxDestination = message.split('Destination IP: ', 2);
	const destination = auxDestination[1].split('Destination', 1)[0];

	const auxDestinationPort = message.split('Destination Port: ', 2);
	const destinationPort = auxDestinationPort[1].split('Rule', 1)[0];

	const auxSource = message.split('Source IP: ', 2);
	const source = auxSource[1].split('Source', 1)[0];

	const auxSourcePort = message.split('Source Port: ', 2);
	const sourcePort = auxSourcePort[1].split('Destination', 1)[0];

	const auxRuleID = message.split('Rule ID: ', 2);
	const ruleId = auxRuleID[1].split(',', 1)[0];

	const auxPolicy = message.split('Policy Name: ', 2);
	const policy = auxPolicy[1].split('\n', 1)[0];

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

	console.log(`Appliance: ${appliance}`);

	await ipsEmailSender(
		appliance,
		destination,
		source,
		ruleId,
		policy,
		timeString,
		description,
		destinationPort,
		sourcePort,
	);
};

const parseIPSEmailsFromCloud = async (message) => {
	const auxLocal = message.split('device ', 2);
	const local = auxLocal[1].split(':', 1)[0];
	const auxDestination = message.split('Destination IP: ', 2);
	const destinationIp = auxDestination[1].split('Destination', 1)[0];
	const auxDestinationPort = message.split('Destination Port: ', 2);
	const destinationPort = auxDestinationPort[1].split('\n', 1)[0];
	const auxSource = message.split('Source IP:\n', 2);
	const sourceIp = auxSource[1].split('Source', 1)[0];
	const auxSourcePort = message.split('Source Port: ', 2);
	const sourcePort = auxSourcePort[1].split('Destination', 1)[0];
	const auxRuleID = message.split('Rule ID: ', 2);
	const ruleId = auxRuleID[1].split(',', 1)[0];
	const auxPolicy = message.split('Policy Name: ', 2);
	const policy = auxPolicy[1].split('\n', 1)[0];

	// const auxWhen = message.split('WHEN:\n\n', 2);
	// const when = auxWhen[1].split('\n', 1)[0];

	const dayString = capitalizeFirstLetter(
		new Date().toLocaleString('pt-BR', {
			dateStyle: 'long',
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
	);

	const hourString = new Date().toLocaleString('pt-BR', {
		timeStyle: 'short',
		hour12: false,
	});

	const dateString = `${dayString} às ${hourString}`;

	await ipsCloudEmailSender(
		local,
		destinationIp,
		sourceIp,
		ruleId,
		policy,
		dateString,
		destinationPort,
		sourcePort,
	);

	// console.log(`Local: ${local}`);
	// console.log(`Ip Destino: ${destinationIp}`);
	// console.log(`Porta Destino: ${destinationPort}`);
	// console.log(`Ip Origem: ${sourceIp}`);
	// console.log(`Porta Origem: ${sourcePort}`);
	// console.log(`Descrição: ${description}`);
	// console.log(`RuleID: ${ruleId}`);
	// console.log(`Política: ${policy}`);
	// console.log(`Quando: ${when}`);
	// console.log(`Dia: ${dayString}`);
	// console.log(`Hora: ${hourString}`);
};

const parsePORTSCAMEmailsFromCloud = async (message) => {
	const auxLocal = message.split('device ', 2);
	const local = auxLocal[1].split(':', 1)[0];
	const auxDestination = message.split('against ', 2);
	const destinationIp = auxDestination[1].split('from', 1)[0];
	const auxSource = message.split('from ', 2);
	const sourceIp = auxSource[1].split('detected', 1)[0];
	const description = 'Port Scam Attack';

	// const auxWhen = message.split('<h4>When:</h4>\n', 2);
	// const when = auxWhen[1].split('\n', 1)[0];

	const dayString = capitalizeFirstLetter(
		new Date().toLocaleString('pt-BR', {
			dateStyle: 'long',
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
	);

	const hourString = new Date().toLocaleString('pt-BR', {
		timeStyle: 'short',
		hour12: false,
	});

	const dateString = `${dayString} às ${hourString}`;

	await portScamCloudEmailSender(local, destinationIp, sourceIp, dateString);

	// console.log(`Local: ${local}`);
	// console.log(`Ip Destino: ${destinationIp}`);
	// console.log(`Ip Origem: ${sourceIp}`);
	// console.log(`Descrição: ${description}`);
	// console.log(`Dia: ${dateString}`);
	// console.log(`Hora: ${hourString}`);
};

const parseAVEmails = async (message) => {
	const auxAppliance = message.split('Appliance: ', 2);
	const appliance = auxAppliance[1].split('\n', 1)[0];

	const auxDestination = message.split('Destination IP: ', 2);
	const destination = auxDestination[1].split(' ', 1)[0];

	const auxSource = message.split('Source IP: ', 2);
	const source = auxSource[1].split(' ', 1)[0];

	const auxPolicy = message.split('Policy Name: ', 2);
	const policy = auxPolicy[1].split(' ', 1)[0];

	const auxAuthUser = message.split('User: ', 2);
	const authUser = auxAuthUser[1].split(' ', 1)[0];

	const auxVirus = message.split('virus: ', 2);
	const virus = auxVirus[1].split(' ', 1)[0];

	const auxHost = message.split('host: ', 2);
	const host = auxHost[1].split(' ', 1)[0];

	const auxPath = message.split('path: ', 2);
	const path = auxPath[1].split('\n', 1)[0];

	const description = 'Gateway Antivírus Policies';
	const reason = 'Virus encontrado';

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

	console.log(`Appliance: ${appliance}`);

	// console.log(appliance);
	// console.log(destination);
	// console.log(source);
	// console.log(policy);
	// console.log(timeString);
	// console.log(description);
	// console.log(reason);
	// console.log(authUser);
	// console.log(virus);
	// console.log(host);
	// console.log(path);

	await aVEmailSender(
		appliance,
		destination,
		source,
		policy,
		timeString,
		description,
		reason,
		authUser,
		virus,
		host,
		path,
	);
};

const emailStalker = async () => {
	console.log('Stalker Running');

	const config = {
		imap: {
			user: process.env.MAILER_EMAIL,
			password: process.env.MAILER_PASS,
			host: 'outlook.office365.com',
			port: 993,
			tls: true,
			tlsOptions: { rejectUnauthorized: false },
			authTimeout: 3000,
		},
	};

	await imaps
		.connect(config)
		.then(function (connection) {
			return connection
				.openBox('INBOX')
				.then(function () {
					let searchCriteria = [
						'UNSEEN',
						// ['HEADER', 'FROM', `${process.env.FILTER_FROM}`],
					];
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
								simpleParser(idHeader + all.body, async (err, mail) => {
									const mailText = mail.text;
									const mailHtml = mail.html;
									const mailHtmlAsText = mail.textAsHtml;
									const subject = mail.subject;
									const from = mail.from;

									if (mailHtml && mailHtml.includes('ddos_attack_src_dos')) {
										console.log('DDOS ALERT IGNORED');
										return;
									}

									if (
										mailHtmlAsText &&
										mailHtmlAsText.includes('ddos_attack_src_dos')
									) {
										console.log('DDOS ALERT IGNORED');
										return;
									}

									if (mailText && mailText.includes('ddos_attack_src_dos')) {
										console.log('DDOS ALERT IGNORED');
										return;
									}

									if (process.env.STALKER_ENV === 'CLOUD') {
										if (from.text === `${process.env.CLOUD_EMAIL}`) {
											console.log('Analizing email from cloud...');
											if (mailHtml.includes('port_scan_dos')) {
												console.log('PORT SCAM ALERT');
												await parsePORTSCAMEmailsFromCloud(mailHtml);
											}
											if (mailHtml.includes('IPS match')) {
												console.log('IPS MATCH ALERT');
												await parseIPSEmailsFromCloud(mailText);
											}
										}
									} else {
										console.log('Analizing email from local...');
										if (mailText.includes('IPS')) {
											console.log('IPS EMAIL');
											await parseIPSEmails(mailText);
										}
										if (mailText.includes('-av')) {
											console.log('AV EMAIL');
											await parseAVEmails(mailText);
										}
									}
								});
							});
						})
						.then(() => {
							connection.end();
							console.log('Stalker Finished');
							console.log('Connection closed');
							console.log(new Date().toISOString());
						})
						.catch((err) => {
							console.log(err);
							connection.end();
						});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = { emailStalker };
