const { Model, DataTypes } = require('sequelize');
const { v4: uuid } = require('uuid');

class ReceivedEmail extends Model {
	static init(sequelize) {
		super.init(
			{
				appliance: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				destination_ip: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				source_ip: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				destination_port: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				source_port: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				type: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				modelName: 'ReceivedEmail',
			},
		);

		super.beforeCreate((receivedEmail, _) => {
			return (receivedEmail.id = uuid());
		});
	}
}
module.exports = ReceivedEmail;
