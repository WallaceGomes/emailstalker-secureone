const imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');
const ReceivedEmail = require('../models/ReceivedEmail');
const { subMinutes, subSeconds, subHours, subDays } = require('date-fns');
const { Op } = require('sequelize');

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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança Intrusion Prevention!',
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
						style="color:rgb(243,144,29); font-family:Calibri,sans-serif; font-size:11pt">${appliance}</span><span
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
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">Proteção executada com sucesso</span></b><span
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
					</b><span style="font-family:Calibri,sans-serif; font-size:11pt; color:rgb(85,85,85)">${time}</span><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">
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
			<p class="x_x_MsoNormal" align="center"
				style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span
						style="margin:0px">&nbsp;</span><a href="mailto:atendimento@secureone.com.br"
						style="margin:0px">atendimento@secureone.com.br</a><span style="margin:0px">
						&nbsp;</span>&nbsp;</span>
			</p>
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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança Gateway Antivírus!',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(200,38,19)">Alerta de segurança!</span>
			</h3>
			<h4 style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sa
				ns-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif"><b style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit">Categoria</b>:
						<span style="color:rgb(200,38,19)">Gateway Antivírus Policies</span><br>
					</div>
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
						<div><span style="color:rgb(200,38,19)"><br>
							</span></div>
						<div><b>Local</b>: <span style="color:rgb(200,38,19)">${appliance}</span>
						</div>
						<div><b>Razão</b>: <span style="color:rgb(200,38,19)">Virus encontrado</span></div>
						<div><b></b><b style="background-color:rgb(255,255,255)"><b style="background-color:rgb(255,255,255)">Ação:<span style="margin:0px">&nbsp;</span></b><span style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">Proteção executada com sucesso</span></b></div>
						<div><b>Usuário autenticado</b>: <span style="color:rgb(0,0,0)">${authUser}</span>
						</div>
						<div><b>Origem</b>: ${source} </div>
						<div><b>Destino</b>: ${destination} </div>
						<div><b>Hora</b>: ${timeString} </div>
						<div><b>Política</b>: ${policy} </div>
						<div><br>
						</div>
						<div><br>
						</div>
						<div>Informações do Vírus:</div>
						<div><br>
						</div>
						<div><b>Virus</b>: <span style="color:rgb(200,38,19)">${virus}</span></div>
						<div><b>Host</b>:<a style="color:rgb(200,38,19); text-decoration: none"> ${host}</a></div>
						<b>Path</b>: <span style="color:rgb(200,38,19)">${path}</span>
						<br>
					</div>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><span style="color:rgb(200,38,19); font-family:Calibri,sans-serif; font-size:14.6667px; background-color:rgb(255,255,255); display:in
				line!important">Gateway
						Antivírus Policies</span><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
			Assinaturas atualizadas continuamente para identificar e bloquear spywares, vírus, cavalos de troia, rogueware e ameaças mistas,
					não
					só para os vírus conhecidos
					como também para as suas novas variações. Ao mesmo tempo, a análise heurística rastreia dados, construções e ações
					sus
					peitos para garantir que os vírus desconhecidos não passem despercebidos.<br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
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
			<p class="x_x_MsoNormal" align="center" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span>&nbsp;</span><a href="mailto:atendi
				mento@secureone.com.br" style="margin:0px">atendimento@secureone.com.br</a><span>&nbsp;</span>&nbsp;</span>
			</p>
			<br>
			</div>

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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança Intrusion Prevention!',
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
			<p class="x_x_MsoNormal" align="center"
				style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span
						style="margin:0px">&nbsp;</span><a href="mailto:atendimento@secureone.com.br"
						style="margin:0px">atendimento@secureone.com.br</a><span style="margin:0px">
						&nbsp;</span>&nbsp;</span>
			</p>
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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança Port Scan!',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(81,167,249)">Alerta de segurança!</span>
			</h3>
			<h4
				style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<b style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit">Categoria</b>:<span style="color:rgb(81,167,249)">&nbsp;</span><span style="color:rgb(81,167,249)">Port Scan</span><br>
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

const virusCloudEmailSender = async (
	local,
	destination,
	source,
	policy,
	dateString,
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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança Gateway Antivírus!',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(200,38,19)">Alerta de segurança!</span>
			</h3>
			<h4 style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sa
				ns-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif"><b style="color:inherit; font-family:inherit; font-size:inherit; font-style:inherit; font-variant-ligatures:inherit; font-variant-caps:inherit">Categoria</b>:
						<span style="color:rgb(200,38,19)">Gateway Antivírus Policies</span><br>
					</div>
					<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
						<div><span style="color:rgb(200,38,19)"><br>
							</span></div>
						<div><b>Local</b>: <span style="color:rgb(200,38,19)">${local}</span>
						</div>
						<div><b>Razão</b>: <span style="color:rgb(200,38,19)">Virus encontrado</span></div>
						<div><b></b><b style="background-color:rgb(255,255,255)"><b style="background-color:rgb(255,255,255)">Ação:<span style="margin:0px">&nbsp;</span></b><span style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">Proteção executada com sucesso</span></b></div>
						<div><b>Usuário autenticado</b>: <span style="color:rgb(0,0,0)">${authUser}</span>
						</div>
						<div><b>Origem</b>: ${source} </div>
						<div><b>Destino</b>: ${destination} </div>
						<div><b>Hora</b>: ${dateString} </div>
						<div><b>Política</b>: ${policy} </div>
						<div><br>
						</div>
						<div><br>
						</div>
						<div>Informações do Vírus:</div>
						<div><br>
						</div>
						<div><b>Virus</b>: <span style="color:rgb(200,38,19)">${virus}</span></div>
						<div><b>Host</b>:<a style="color:rgb(200,38,19); text-decoration: none"> ${host}</a></div>
						<b>Path</b>: <span style="color:rgb(200,38,19)">${path}</span>
						<br>
					</div>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><span style="color:rgb(200,38,19); font-family:Calibri,sans-serif; font-size:14.6667px; background-color:rgb(255,255,255); display:in
				line!important">Gateway
						Antivírus Policies</span><br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
			Assinaturas atualizadas continuamente para identificar e bloquear spywares, vírus, cavalos de troia, rogueware e ameaças mistas,
					não
					só para os vírus conhecidos
					como também para as suas novas variações. Ao mesmo tempo, a análise heurística rastreia dados, construções e ações
					sus
					peitos para garantir que os vírus desconhecidos não passem despercebidos.<br>
				</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><br>
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
			<p class="x_x_MsoNormal" align="center" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span>&nbsp;</span><a href="mailto:atendi
				mento@secureone.com.br" style="margin:0px">atendimento@secureone.com.br</a><span>&nbsp;</span>&nbsp;</span>
			</p>
			<br>
			</div>

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

const tDREmailSender = async (
	local,
	host,
	score,
	action,
	dateTime,
	id,
	failureReason,
	path,
	file,
	indicatorLink,
	notificationLink,
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
			to: `${process.env.MAILER_EMAIL}`,
			subject: '🔥 Alerta de segurança TDR Comportamento!',
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:13.5pt; margin-right:0cm; margin-left:0cm">
				<span style="color:rgb(59,32,77)">Alerta de segurança!</span>
			</h3>
			<h4 style="color:rgb(0,0,0); font-family:Calibri,sans-serif; font-size:12pt; margin-right:0cm; margin-left:0cm">
				<span style="color:#555555">Informação:&nbsp;</span>
			</h4>
			<div>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>Categoria: </b><span style="color:rgb(59,32,77)">Threat Detection and Response (TDR)</span><span
						style="color:rgb(59,32,77)"><b>
						</b></span><b><span style="color:rgb(59,32,77)">&nbsp;</span><br>
						<br>
					</b>
				</p>
				<p style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin-right:0cm; margin-left:0cm">
					<b style="color:rgb(59,32,77); font-family:Calibri,sans-serif; font-size:11pt">Local:
					</b><span
						style="color:rgb(59,32,77); font-family:Calibri,sans-serif; font-size:11pt">${local}</span><span
						style="color:rgb(59,32,77); font-family:Calibri,sans-serif; font-size:11pt"><b>
						</b></span><b style="color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt"><span
							style="color:rgb(59,32,77)">&nbsp;</span><br>
					</b><b
						style="color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)">Razão:</b><span style="font-weight:400; background-color:rgb(255,255,255); display:inline!important; color:rgb(59,32,77)">Comportamento Suspeito</span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(59,32,77)">Host:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${host}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Score:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${score}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Ação:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${action}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b>ID da assinatura: </b><span style="color:rgb(59,32,77)">${id}</span><span style="color:rgb(59,32,77)"><b>
						</b></span><b><span style="color:rgb(59,32,77)">&nbsp;</span><br>
					</b><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">Hora:
					</b><span style="font-family:Calibri,sans-serif; font-size:11pt; color:rgb(85,85,85)">${dateTime}</span><b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit">
						&nbsp;</b><b><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Motivo:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${failureReason}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Detalhes do indicador:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${path}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<p
					style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; color:rgb(85,85,85); font-family:Calibri,sans-serif; font-size:11pt; margin-right:0cm; margin-left:0cm">
					<b style="font-size:11pt; font-variant-ligatures:inherit; font-variant-caps:inherit"><b
							style="background-color:rgb(255,255,255)"></b><b style="background-color:rgb(255,255,255)"><b
								style="background-color:rgb(255,255,255)">Arquivo:<span style="margin:0px">&nbsp;</span></b><span
								style="margin:0px; font-weight:400; background-color:rgb(255,255,255); display:inline!important">${file}</span></b><span
							style="font-weight:400; background-color:rgb(255,255,255); display:inline!important"></span><br>
					</b>
				</p>
				<br>
			</div>
			<div style=""><span style="font-family:Calibri,Helvetica,sans-serif">Indicador link:</span>
				<div><span style="font-family:Calibri,Helvetica,sans-serif"><a
							href="${indicatorLink}"
							id="LPlnk677473">${indicatorLink}</a></span><br>
				</div>
				<div><br>
				</div>
				<div><br>
				</div>
			</div>
			<div style=""><span style="font-family:Calibri,Helvetica,sans-serif">Notificação link:</span>
				<div><span style="font-family:Calibri,Helvetica,sans-serif"><a
							href="${notificationLink}"
							id="LPlnk677473">${notificationLink}</a></span><br>
				</div>
				<div><br>
				</div>
				<div><br>
				</div>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555"><span
						style="margin:0px; font-size:14.6667px; font-family:Calibri,sans-serif; color:rgb(59,32,77); background-color:rgb(255,255,255)">Threat Detection and Response (TDR)</span><span
						style="margin:0px; font-size:14.6
			667px; font-family:Calibri,sans-serif; color:rgb(59,32,77); background-color:rgb(255,255,255)"><b><span>&nbsp;</span>
						</b></span><b
						style="font-family:Calibri,sans-serif; font-size:14.6667px; background-color:rgb(255,255,255)"><span styl
							e="margin:0px; color:rgb(59,32,77)">&nbsp;</span></b></span>
			</div>
			<div style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt">
				<span style="color:#555555">O WatchGuard Threat Detection and Response (TDR) é uma poderosa coleção de ferramentas avançadas de defesa contra malware que correlaciona indicadores de ameaças dos appliances Firebox e sensores de host para parar ameaças conhecidas, desconhecidas e evasivas.<br>
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
			<p class="x_x_MsoNormal" align="center"
				style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span
						style="margin:0px">&nbsp;</span><a href="mailto:atendimento@secureone.com.br"
						style="margin:0px">atendimento@secureone.com.br</a><span style="margin:0px">
						&nbsp;</span>&nbsp;</span>
			</p>
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

const linkDownEmailSender = async (host, operadora, dateString) => {
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
			to: `${process.env.MAILER_EMAIL}`,
			subject: `❌ Atenção! Link "${operadora}" offline`,
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(237,92,87)">Monitoramento - Notificação</span>
			</h3>
			<h4 style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sa
				ns-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
				<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<div><b>Local</b>: <span style="color:rgb(237,92,87)">${host}</span>
					</div>
					<div><b>Operadora</b>: <span style="color:rgb(237,92,87)">${operadora}</span></div>
					<div><b>Status</b>: <span style="color:rgb(237,92,87)">Offline</span></div> </div>
					<div style="font-size:11pt;"><b>Hora e data de início</b>: Problema começou em <span style="color:rgb(237,92,87)">${dateString}</span></div>
					<div><br>
					</div>
					<div><br>
					</div>
					<br>
				</div>
			</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><b><span
							style="margin:0px"><span style="margin:0px">Sistema de monitoramento Secureone</span></span><br>
					</b><span style="margin:0px"></span><br>
				</span></div>
			<p class="x_x_MsoNormal" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color
				:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
				<br>
			</p>
			<p class="x_x_MsoNormal" align="center" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span>&nbsp;</span><a href="mailto:atendi
				mento@secureone.com.br" style="margin:0px">atendimento@secureone.com.br</a><span>&nbsp;</span>&nbsp;</span>
			</p>
			<br>
			</div>
		</body>
		`,
		})
		.then(() => {
			console.log(`Email delivered to client ${operadora}`);
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

const linkUpEmailSender = async (
	host,
	operadora,
	initialDateString,
	finalDateString,
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

	transport
		.sendMail({
			from: process.env.MAILER_EMAIL,
			to: `${process.env.MAILER_EMAIL}`,
			subject: `✅ Resolvido! Link "${operadora}" online`,
			html: `<body style="max-width: 1080px; margin-top: 20px; margin-left: 10px; font-family: 'Calibri', sans-serif;">
			<h3 style="margin:0px 0cm 6px; background-color:rgb(255,255,255); font-size:13.5pt; font-family:Calibri,sans-serif">
				<span style="margin:0px; color:rgb(111,192,64)">Monitoramento - Notificação</span>
			</h3>
			<h4 style="font-size:12pt; background-color:rgb(255,255,255); margin-right:0cm; margin-left:0cm; font-family:Calibri,sa
				ns-serif">
				<span style="margin:0px; color:rgb(85,85,85)">Informação:&nbsp;</span>
			</h4>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)">
				<div style="margin:0px 0cm; font-size:11pt; font-family:Calibri,sans-serif">
					<div><b>Local</b>: <span style="color:rgb(111,192,64)">${host}</span>
					</div>
					<div><b>Operadora</b>: <span style="color:rgb(111,192,64)">${operadora}</span></div>
					<div><b>Status</b>: <span style="color:rgb(111,192,64)">Online</span></div> </div>
					<div style="font-size:11pt;"><b>Hora e data de início</b>: Problema começou em <span style="color:rgb(237,92,87)">${initialDateString}</span></div>
					<div style="font-size:11pt;"><b>Hora e data de término</b>: Problema resolvido em <span style="color:rgb(111,192,64)">${finalDateString}</span></div>
					<div><br>
					</div>
					<div><br>
					</div>
					<br>
				</div>
			</span></div>
			<div style="margin:0px; background-color:rgb(255,255,255)"><span style="margin:0px; color:rgb(85,85,85)"><b><span
							style="margin:0px"><span style="margin:0px">Sistema de monitoramento Secureone</span></span><br>
					</b><span style="margin:0px"></span><br>
				</span></div>
			<p class="x_x_MsoNormal" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; background-color
				:rgb(255,255,255); margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
				<br>
			</p>
			<p class="x_x_MsoNormal" align="center" style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif; text-align:center; background:rgb(221,221,221)">
				<span style="margin:0px; font-size:9pt; color:rgb(85,85,85)">SECUREONE SERVICOS DE SEGURANCA DA INFORMACAO LTDA<br>
					Av Paulista, 807 – 23º andar São Paulo - SP Cep: 01311-915 Tel: (11) 3164-3031<span>&nbsp;</span><a href="mailto:atendi
				mento@secureone.com.br" style="margin:0px">atendimento@secureone.com.br</a><span>&nbsp;</span>&nbsp;</span>
			</p>
			<br>
			</div>
		</body>
		`,
		})
		.then(() => {
			console.log(`Email delivered to client ${operadora}`);
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

const parseAVEmailsFromCloud = async (message) => {
	const auxLocal = message.split('device ', 2);
	const local = auxLocal[1].split(':', 1)[0];

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

	try {
		const now = new Date();

		const nowMinusSettedMinutes = subMinutes(
			now,
			process.env.MINUTES_TO_PREVENT_EMAILS,
		);

		const checkedEmail = await ReceivedEmail.findOne({
			where: {
				appliance: local,
				destination_ip: destination,
				source_ip: source,
				type: 'AV',
				createdAt: {
					[Op.between]: [nowMinusSettedMinutes, now],
				},
			},
			logging: false,
		});

		if (checkedEmail) {
			console.log('Prevented email copy of being delivered...');
			return;
		}

		await ReceivedEmail.create({
			appliance: local,
			destination_ip: destination,
			source_ip: source,
			type: 'AV',
		});
	} catch (err) {
		console.log(err);
	}

	await virusCloudEmailSender(
		local,
		destination,
		source,
		policy,
		dateString,
		authUser,
		virus,
		host,
		path,
	);
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

	try {
		const now = new Date();

		const nowMinusSettedMinutes = subMinutes(
			now,
			process.env.MINUTES_TO_PREVENT_EMAILS,
		);

		const checkedEmail = await ReceivedEmail.findOne({
			where: {
				appliance: appliance,
				destination_ip: destination,
				source_ip: source,
				type: 'IPS',
				createdAt: {
					[Op.between]: [nowMinusSettedMinutes, now],
				},
			},
			logging: false,
		});

		if (checkedEmail) {
			console.log('Prevented email copy of being delivered...');
			return;
		}

		await ReceivedEmail.create({
			appliance: appliance,
			destination_ip: destination,
			source_ip: source,
			type: 'IPS',
		});
	} catch (err) {
		console.log(err);
	}

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
	const destinationPort = auxDestinationPort[1].split('Rule', 1)[0];
	const auxSource = message.split('Source IP: ', 2);
	const sourceIp = auxSource[1].split('Source', 1)[0];
	const auxSourcePort = message.split('Source Port: ', 2);
	const sourcePort = auxSourcePort[1].split('Destination', 1)[0];
	const auxRuleID = message.split('Rule ID: ', 2);
	const ruleId = auxRuleID[1].split(',', 1)[0];
	const auxPolicy = message.split('Policy Name: ', 2);
	const policy = auxPolicy[1].split(' ', 1)[0];

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

	try {
		const now = new Date();

		const nowMinusSettedMinutes = subMinutes(
			now,
			process.env.MINUTES_TO_PREVENT_EMAILS,
		);

		const checkedEmail = await ReceivedEmail.findOne({
			where: {
				appliance: local,
				destination_ip: destinationIp,
				source_ip: sourceIp,
				type: 'IPS',
				createdAt: {
					[Op.between]: [nowMinusSettedMinutes, now],
				},
			},
			logging: false,
		});

		if (checkedEmail) {
			console.log('Prevented email copy of being delivered...');
			return;
		}

		await ReceivedEmail.create({
			appliance: local,
			destination_ip: destinationIp,
			source_ip: sourceIp,
			type: 'IPS',
		});
	} catch (err) {
		console.log(err);
	}

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
};

const parsePORTSCAMEmailsFromCloud = async (message) => {
	const auxLocal = message.split('device ', 2);
	const local = auxLocal[1].split(':', 1)[0];
	const auxDestination = message.split('against ', 2);
	const destinationIp = auxDestination[1].split('from', 1)[0];
	const auxSource = message.split('from ', 2);
	const sourceIp = auxSource[1].split('detected', 1)[0];
	const description = 'Port Scam Attack';

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

	try {
		const now = new Date();

		const nowMinusSettedMinutes = subMinutes(
			now,
			process.env.MINUTES_TO_PREVENT_EMAILS,
		);

		const checkedEmail = await ReceivedEmail.findOne({
			where: {
				appliance: local,
				destination_ip: destinationIp,
				source_ip: sourceIp,
				type: 'PORTSCAM',
				created_at: {
					[Op.between]: [nowMinusSettedMinutes, now],
				},
			},
			logging: false,
		});

		if (checkedEmail) {
			console.log('Prevented email copy of being delivered...');
			return;
		}

		await ReceivedEmail.create({
			appliance: local,
			destination_ip: destinationIp,
			source_ip: sourceIp,
			type: 'PORTSCAM',
		});
	} catch (err) {
		console.log(err);
	}

	await portScamCloudEmailSender(local, destinationIp, sourceIp, dateString);
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

	try {
		const now = new Date();

		const nowMinusSettedMinutes = subMinutes(
			now,
			process.env.MINUTES_TO_PREVENT_EMAILS,
		);

		const checkedEmail = await ReceivedEmail.findOne({
			where: {
				appliance: appliance,
				destination_ip: destination,
				source_ip: source,
				type: 'AV',
				createdAt: {
					[Op.between]: [nowMinusSettedMinutes, now],
				},
			},
			logging: false,
		});

		if (checkedEmail) {
			console.log('Prevented email copy of being delivered...');
			return;
		}

		await ReceivedEmail.create({
			appliance: appliance,
			destination_ip: destination,
			source_ip: source,
			type: 'AV',
		});
	} catch (err) {
		console.log(err);
	}

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

const parseTDREmails = async (message) => {
	const auxLocal = message.split('Account: ', 2);
	const local = auxLocal[1].split('\n', 1)[0];

	const auxHost = message.split('Host: ', 2);
	const host = auxHost[1].split('\n', 1)[0];

	const auxScore = message.split('Score: ', 2);
	const score = auxScore[1].split('\n', 1)[0];

	const auxAction = message.split('Action: ', 2);
	const action = auxAction[1].split('\n', 1)[0];

	const auxDateTime = message.split('Attempted Date/Time: ', 2);
	const dateTime = auxDateTime[1].split('UTC', 1)[0];

	const auxId = message.split('Id: ', 2);
	const id = auxId[1].split('\n', 1)[0];

	const auxFailureReason = message.split('Failure Reason: ', 2);
	const failureReason = auxFailureReason[1].split('\n', 1)[0];

	const auxPath = message.split('Path: ', 2);
	const path = auxPath[1].split('\n', 1)[0];

	const auxFile = message.split('File: ', 2);
	const file = auxFile[1].split('\n', 1)[0];

	const auxIndicatorLink = message.split('Indicator link: ', 2);
	const indicatorLink = auxIndicatorLink[1].split('\n', 1)[0];

	const auxNotificationLink = message.split('Notification link: ', 2);
	const notificationLink = auxNotificationLink[1].split('\n', 1)[0];

	tDREmailSender(
		local,
		host,
		score,
		action,
		dateTime,
		id,
		failureReason,
		path,
		file,
		indicatorLink,
		notificationLink,
	);
};

const parseLinkDownEmails = async (message) => {
	const auxOperadora = message.split('Link Operadora ', 2);
	const operadora = auxOperadora[1].split(' -', 1)[0];

	const auxHost = message.split('HOST ', 2);
	const host = auxHost[1].split('<br/>', 1)[0];

	const auxInitialDateHour = message.split(';ou &agrave;s ', 2);
	const initialDateHour = auxInitialDateHour[1].split(' em ', 1)[0];

	const aux1InitalDateDay = message.split(' em ', 2);
	const aux2InitialDateDay = aux1InitalDateDay[1].split(' HOST', 1)[0];

	const dateDayArray = aux2InitialDateDay.split('.');
	const hourArray = initialDateHour.split(':');

	const initialDateString = new Date(
		dateDayArray[0],
		dateDayArray[1] - 1,
		dateDayArray[2],
		hourArray[0],
		hourArray[1],
		hourArray[2],
	).toLocaleString('pt-BR');

	// console.log(`Operadora: ${operadora}`);
	// console.log(`Host: ${host}`);
	// console.log(`Initial Date: ${initialDateString}`);

	await linkDownEmailSender(host, operadora, initialDateString);
};

const parseLinkUpEmails = async (message) => {
	const auxOperadora = message.split('Link Operadora ', 2);
	const operadora = auxOperadora[1].split('-', 1)[0];

	const auxHost = message.split('HOST ', 2);
	const host = auxHost[1].split('<br/>', 1)[0];

	const auxDuracao = message.split('Dura&ccedil;&atilde;o ', 2);
	const duracao = auxDuracao[1].split('<br/>Status', 1)[0];

	let duracaoDias = '0';
	let duracaoHoras = '0';
	let duracaoMinutos = '0';
	let duracaoSegundos = '0';

	if (duracao.includes('d')) {
		const auxDuracaoDias = duracao.split('d', 1)[0];
		duracaoDias = auxDuracaoDias;
		// console.log(`Duracao dias: |${duracaoDias}|`);
	}
	if (duracao.includes('h')) {
		const auxDuracaoHoras = duracao.split('h', 1)[0];
		if (auxDuracaoHoras.includes('d')) {
			duracaoHoras = auxDuracaoHoras.split(' ', 2)[1];
		} else {
			duracaoHoras = auxDuracaoHoras;
		}
		// console.log(`duracao horas: |${duracaoHoras}|`);
	}
	if (duracao.includes('m')) {
		const auxDuracaoMinutos = duracao.split('m', 1)[0];
		if (auxDuracaoMinutos.includes('h') && auxDuracaoMinutos.includes('d')) {
			duracaoMinutos = auxDuracaoMinutos.split(' ', 3)[2];
		} else if (
			auxDuracaoMinutos.includes('h') &&
			!auxDuracaoMinutos.includes('d')
		) {
			duracaoMinutos = auxDuracaoMinutos.split(' ', 2)[1];
		} else {
			duracaoMinutos = auxDuracaoMinutos;
		}
		// console.log(`Duracao minutos: |${duracaoMinutos}|`);
	}
	if (duracao.includes('s')) {
		const auxDuracaoSegundos = duracao.split('s', 1)[0];
		if (
			auxDuracaoSegundos.includes('h') &&
			auxDuracaoSegundos.includes('d') &&
			auxDuracaoSegundos.includes('m')
		) {
			duracaoSegundos = auxDuracaoSegundos.split(' ', 4)[3];
		} else if (
			!auxDuracaoSegundos.includes('h') &&
			auxDuracaoSegundos.includes('d') &&
			auxDuracaoSegundos.includes('m')
		) {
			duracaoSegundos = auxDuracaoSegundos.split(' ', 3)[2];
		} else if (
			!auxDuracaoSegundos.includes('h') &&
			!auxDuracaoSegundos.includes('d') &&
			auxDuracaoSegundos.includes('m')
		) {
			duracaoSegundos = auxDuracaoSegundos.split(' ', 2)[1];
		} else {
			duracaoSegundos = auxDuracaoSegundos;
		}
		// console.log(`Duracao segundos: |${duracaoSegundos}|`);
	}

	const auxFinalDateHour = message.split('resolvido &agrave;s ', 2);
	const finalDateHour = auxFinalDateHour[1].split(' em ', 1)[0];
	const finalDateHourArray = finalDateHour.split(':');

	const aux2InitalDateDay = message.split(' em ', 2);
	const aux2FinalDateDay = aux2InitalDateDay[1].split(' HOST', 1)[0];

	const finalDateArray = aux2FinalDateDay.split('.');

	let auxInitialDate = new Date(
		finalDateArray[0],
		finalDateArray[1] - 1,
		finalDateArray[2],
		finalDateHourArray[0],
		finalDateHourArray[1],
		finalDateHourArray[2],
	);

	const initialDate = subSeconds(
		subMinutes(
			subHours(subDays(auxInitialDate, duracaoDias), duracaoHoras),
			duracaoMinutos,
		),
		duracaoSegundos,
	);

	const initialDateString = initialDate.toLocaleString('pt-BR');

	const finalDateString = new Date(
		finalDateArray[0],
		finalDateArray[1] - 1,
		finalDateArray[2],
		finalDateHourArray[0],
		finalDateHourArray[1],
		finalDateHourArray[2],
	).toLocaleString('pt-br');

	// console.log(`Host: ${host}`);
	// console.log(`operadora: ${operadora}`);
	// console.log(`initialDateString: ${initialDateString}`);
	// console.log(`finalDateString: ${finalDateString}`);

	await linkUpEmailSender(host, operadora, initialDateString, finalDateString);
};

const emailStalker = async () => {
	console.log('Stalker Running...');

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

									// Link Operadora

									if (from.text === `${process.env.MAILER_EMAIL}`) {
										return;
									}

									if (
										mailHtml &&
										mailHtml.includes('Problema começou') &&
										mailHtml.includes('Link Operadora')
									) {
										parseLinkDownEmails(mailHtmlAsText);
										return;
									}

									if (
										mailHtml &&
										mailHtml.includes('Problema resolvido') &&
										mailHtml.includes('Link Operadora')
									) {
										parseLinkUpEmails(mailHtmlAsText);
										return;
									}

									if (mailText && mailText.includes('Indicator Details')) {
										await parseTDREmails(mailText);
										return;
									}

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

									//aplicar formato novo para os emails antigos

									if (from.text === `${process.env.CLOUD_EMAIL}`) {
										console.log('Analizing email from cloud...');
										if (mailHtml.includes('port_scan_dos')) {
											console.log('PORT SCAM ALERT');
											await parsePORTSCAMEmailsFromCloud(mailHtml);
										}
										if (mailHtml.includes('IPS match')) {
											console.log('IPS MATCH ALERT');
											await parseIPSEmailsFromCloud(mailHtml);
										}

										if (mailHtml.includes('-av')) {
											console.log('ANTI VIRUS ALERT');
											await parseAVEmailsFromCloud(mailHtml);
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
