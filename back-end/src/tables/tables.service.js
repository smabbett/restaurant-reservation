const knex = require('../db/connection');

function create(newTable) {
  return knex('tables').insert(newTable).returning('*');
}

async function list() {
  return knex('tables').select('*').orderBy('table_name');
}

async function update(updatedTable) {
  return knex('tables')
    .select('*')
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, '*')
    .returning('*');
}

async function read(table_id) {
  return knex('tables').select('*').where({ table_id: table_id }).first();
}

async function finish(table_id) {
  return knex('tables')
    .select('*')
    .where({ table_id: table_id })
    .update('reservation_id', null)
    .returning('*');
}

module.exports = {
  create,
  list,
  read,
  update,
  finish,
};
