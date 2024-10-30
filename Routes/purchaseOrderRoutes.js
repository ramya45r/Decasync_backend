const express = require('express');
const purchaseOrderController = require('../Controllers/purchaseorderController');
const router = express.Router();

router.post('/', purchaseOrderController.createPurchaseOrder);

router.get('/', purchaseOrderController.getAllPurchaseOrders);

router.get('/:id', purchaseOrderController.getPurchaseOrderById);


module.exports = router;
