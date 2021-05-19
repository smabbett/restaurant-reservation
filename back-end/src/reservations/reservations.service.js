const knex = require('../db/connection');

function list() {
  return (
    knex('reservations as r')
      .select('r.*')
      //.orderBy('reservation_date')
      .orderBy('reservation_time')
  );
}

function listByDate(date) {
  return knex('reservations as r')
    .select('r.*')
    .where({ reservation_date: date })
    .orderBy('reservation_time');
}

function create(newReservation) {
  return knex('reservations').insert(newReservation).returning('*');
}

module.exports = {
  list,
  create,
  listByDate,
};
