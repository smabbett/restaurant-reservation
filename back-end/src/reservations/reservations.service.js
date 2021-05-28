const knex = require('../db/connection');

function list() {
  return knex('reservations as r')
    .select('r.*')
    .orderBy('reservation_date')
    .orderBy('reservation_time');
}

function listByDate(date) {
  return knex('reservations as r')
    .select('r.*')
    .where({ reservation_date: date })
    .whereNot({ status: 'finished' })
    .orderBy('reservation_time');
}

function create(newReservation) {
  return knex('reservations').insert(newReservation).returning('*');
}

function read(reservation_id) {
  return knex('reservations as r')
    .select('r.*')
    .where({ reservation_id: reservation_id })
    .first();
}

function updateStatus(updatedReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: updatedReservation.reservation_id })
    .update({ status: updatedReservation.status })
    .returning('*');
}

module.exports = {
  list,
  create,
  listByDate,
  read,
  updateStatus,
};
