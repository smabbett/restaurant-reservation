const service = require('./reservations.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({ data: await service.list() });
}

async function listByDate(req, res) {
  // const { reservation_date } = req.query;
  const { date } = req.query;

  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else {
    res.json({ data: await service.list() });
  }
}

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
];

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: 'Reservation cannot be found.' });
}
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(',')}`,
    });
  next();
}

const hasRequiredProperties = hasProperties(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
);

function hasPeople(req, res, next) {
  const { people } = req.body.data;
  const validNumber = Number.isInteger(people);
  if (!validNumber || people <= 0) {
    return next({
      status: 400,
      message: 'Number of people entered is an invalid number.',
    });
  }
  next();
}

function hasValidDateTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  //adjusting the reservation_date to add timestamp, end of day
  let fix_date = reservation_date + ' 23:59:59.999Z';
  let res_date = new Date(fix_date);
  let currentDate = new Date();
  let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
  //setHours to 0 so we can compare dates without time
  res_date.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (reservation_time.match(timeReg) === null) {
    return next({
      status: 400,
      message: `reservation_time is not a valid time.`,
    });
  }
  if (reservation_time < '10:30' || reservation_time > '21:30') {
    return next({
      status: 400,
      message: 'Reservation must be between 10:30AM and 9:30PM.',
    });
  }
  if (
    res_date.getTime() < currentDate.getTime() ||
    (res_date.getTime() === currentDate.getTime() &&
      reservation_time < currentTime)
  ) {
    return next({
      status: 400,
      message: 'Reservation must be booked for future date.',
    });
  }
  if (!res_date.getTime()) {
    return next({
      status: 400,
      message: 'reservation_date is not a valid date.',
    });
  }
  if (res_date.getUTCDay() === 2) {
    return next({
      status: 400,
      message: 'Restaurant closed on Tuesdays.',
    });
  }
  next();
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0],
  });
}

async function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    hasValidDateTime,
    asyncErrorBoundary(create),
  ],
  listByDate: asyncErrorBoundary(listByDate),
  read: [asyncErrorBoundary(reservationExists), read],
};
