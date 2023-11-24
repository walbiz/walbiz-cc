const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const db = require('../utils/database');

const createExtensionQuery = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';

sequelize
  .query(createExtensionQuery)
  .then(() => {
    console.log('uuid-ossp extension created (if not exists)');
  })
  .catch((error) => {
    console.error('Error creating uuid-ossp extension:', error);
  });

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

const Article = db.define(
  'Article',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
