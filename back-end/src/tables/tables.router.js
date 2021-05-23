const router = require('express').Router({ mergeParams: true });
const controller = require('./tables.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router.route('/:table_id/seat').put(controller.update).all(methodNotAllowed);
router
  .route('/')
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
