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
  const { reservation_date } = req.query;

  if (reservation_date) {
    res.json({ data: await service.listByDate(reservation_date) });
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
  const res_date = new Date(reservation_date);

  const currentDate = new Date();

  const currentTime = currentDate.toISOString().substr(11, 5);

  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const res_time = reservation_time.match(timeReg);

  if (!res_time) {
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
    res_date < currentDate ||
    (res_date === currentDate && reservation_time < currentTime)
  ) {
    return next({
      status: 400,
      message: 'Reservation must be booked for future date.',
    });
  }
  if (!res_date.toISOString()) {
    return next({
      status: 400,
      message: 'Reservation date is not a valid date.',
    });
  }
  if (res_date.getDay() === '2') {
    return next({
      status: 400,
      message: 'Reservations not allowed on Tuesdays.',
    });
  }
  next();
}

//how do I use utils/date-time.js ??

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0],
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    hasValidDateTime,
    //hasValidDate,
    asyncErrorBoundary(create),
  ],
  listByDate: asyncErrorBoundary(listByDate),
};
