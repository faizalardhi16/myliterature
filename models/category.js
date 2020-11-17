'use strict';
const {
  Model
} = require('sequelize');
const books = require('./books');


module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.hasMany(models.books)
    }
  };
  category.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};