import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  checkout,
} from '../controllers/cartController.js';

const router = express.Router();

router.route('/:sessionId').get(getCart).delete(clearCart);
router.route('/:sessionId/items').post(addItem);
router.route('/:sessionId/items/:productId').put(updateItem).delete(removeItem);
router.route('/:sessionId/checkout').post(checkout);

export default router;
