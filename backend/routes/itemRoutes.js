const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createItem, getItems, updateItem, softDeleteItem, restoreItem, hardDeleteItem
} = require('../controllers/itemController');

router.get('/', auth(), getItems);

router.post('/',
  auth(),
  [ body('name').notEmpty().withMessage('Name is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be >=1')],
  createItem
);

router.put('/:id', auth(), updateItem);
router.delete('/:id', auth(), softDeleteItem);
router.patch('/:id/restore', auth(), restoreItem);
router.delete('/:id/hard', auth('admin'), hardDeleteItem);

module.exports = router;
