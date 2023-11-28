exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('articles', function (table) {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary().notNullable();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('source').notNullable();
    table.string('description');
    table.text('content').notNullable();
    table.text('image_url');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTable('articles');

  await knex.raw(`
    DROP TRIGGER IF EXISTS set_timestamp ON articles;
    DROP FUNCTION IF EXISTS trigger_set_timestamp();
  `);

  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";');
};
