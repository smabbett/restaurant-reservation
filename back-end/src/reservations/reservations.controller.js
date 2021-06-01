const service = require('./reservations.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.search(mobile_number) });
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
  'status',
  'reservation_id',
  'created_at',
  'updated_at',
];

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  //
  res.locals.reservation = req.body.data;
  //
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

const hasRequiredUpdateProperties = hasProperties('status');

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
function hasStatusBooked(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === 'seated' || status === 'finished') {
    return next({
      status: 400,
      message: `Reservation status ${status} invalid.`,
    });
  }
  next();
}

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

function hasValidDateTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let today = new Date();
  let resDateTime = reservation_date + ' ' + reservation_time;
  let resAsDate = new Date(resDateTime);

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
  if (isNaN(resAsDate.getDate())) {
    return next({
      status: 400,
      message: 'reservation_date is not a valid date.',
    });
  }
  if (resAsDate < today) {
    return next({
      status: 400,
      message: 'Reservation must be booked for future date.',
    });
  }

  if (resAsDate && resAsDate.getDay() === 2) {
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

function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function update(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const updatedRes = await service.update(updatedReservation);
  res.json({ data: updatedRes[0] });
}

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const updatedRes = await service.updateStatus(updatedReservation);
  res.json({ data: updatedRes[0] });
}
function hasValidStatus(req, res, next) {
  //check the status in the request
  const { status } = req.body.data;
  const validStatus = ['booked', 'seated', 'finished', 'cancelled'];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Status ${status} is not valid.`,
    });
  }
  next();
}

function hasNotFinishedStatus(req, res, next) {
  //check the status in the reservation being updated
  const { status } = res.locals.reservation;
  if (status === 'finished') {
    return next({
      status: 400,
      message: `Status ${status} cannot be updated.`,
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasPeople,
    hasValidDateTime,
    hasStatusBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasRequiredProperties,
    hasOnlyValidProperties,
    asyncErrorBoundary(reservationExists),
    hasPeople,
    hasValidDateTime,
    hasStatusBooked,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    hasRequiredUpdateProperties,
    asyncErrorBoundary(reservationExists),
    hasNotFinishedStatus,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
