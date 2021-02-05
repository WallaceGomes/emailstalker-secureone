exports.cronHook = async (req, res, next) => {
	console.log('CRON JOB EXECUTED');

	return res.status(200).send();
};
