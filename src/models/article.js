const Sequelize = require('sequelize');
const db = require('../utils/database');

const Article = db.define(
  'Article',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_url: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'articles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Article;
