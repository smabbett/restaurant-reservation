exports.up = function (knex) {
  return knex.schema.table('reservations', (table) => {
    table.string('status').notNullable().defaultTo('booked'); //Add a new column 'status'
  });
};

exports.down = function (knex) {
  return knex.schema.table('reservations', (table) => {
    table.dropColumn('status');
  });
};
