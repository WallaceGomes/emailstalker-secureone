'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('received_emails', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			appliance: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			destination_ip: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			source_ip: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			destination_port: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			source_port: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('received_emails');
	},
};
