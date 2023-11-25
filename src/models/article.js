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
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    image_url: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'articles',
    createdAt: false,
    updatedAt: 'updated_at',
  }
);

module.exports = Article;
