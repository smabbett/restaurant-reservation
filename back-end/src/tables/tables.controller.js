const service = require('./tables.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const VALID_PROPERTIES = ['table_name', 'capacity'];

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

const hasRequiredProperties = hasProperties('table_name', 'capacity');

async function create(req, res) {
  //   const newTable = req.body.data;

  //   const now = new Date().toISOString();
  //   newTable.table_id = nextId++;
  //   newTable.created_at = now;
  //   newTable.updated_at = now;

  //   tables.push(newTable);
  const newTable = await service.create(req.body.data);
  res.status(201).json({
    data: newTable,
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
