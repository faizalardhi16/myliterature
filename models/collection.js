'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class collection extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			collection.belongsTo(models.books, {
				as: 'books',
				foreignKey: {
					name: 'booksId',
				},
			});

			collection.belongsTo(models.user, {
				as: 'user',
				foreignKey: {
					name: 'userId',
				},
			});
		}
	}

	collection.init(
		{
			userId: DataTypes.INTEGER,
			booksId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'collection',
		}
	);
	return collection;
};
