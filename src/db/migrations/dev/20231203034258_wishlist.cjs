exports.up = async function (knex) {
  await knex.schema.createTable('wishlists', function (table) {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary().notNullable();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('category').notNullable();
    table.string('type').notNullable();
    table.bigint('costs');
    table.bigint('total_outlets');
    table.text('website_url');
    table.bigint('phone_number');
    table.string('email_address');
    table.integer('year_established');
    table.string('company_name');
    table.text('company_address');
    table.bigint('net_profits_per_month');
    table.float('license_duration_in_years');
    table.integer('royalty_fees_per_month');
    table.integer('return_of_investment');
    table.text('logo_image_url');
    table.text('image_url');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('wishlists');
};
