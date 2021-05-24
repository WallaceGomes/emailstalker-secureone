const Sequelize = require('sequelize');
// const database = require('./config/database');

const ReceivedEmail = require('../models/ReceivedEmail');

const connection = new Sequelize(
	process.env.NODE_ENV === 'test'
		? process.env.TEST_DATABASE_URL
		: process.env.DATABASE_URL,
	{
		define: {
			timestamps: true,
			underscored: true,
		},
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
);

// const connection = new Sequelize(database);

ReceivedEmail.init(connection);
