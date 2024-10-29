const express = require('express');
const purchaseOrderController = require('../Controllers/purchaseorderController');
const router = express.Router();

router.post('/', purchaseOrderController.createPurchaseOrder);

router.get('/', purchaseOrderController.getAllPurchaseOrders);

router.get('/:id', purchaseOrderController.getPurchaseOrderById);

router.put('/update/:id', purchaseOrderController.updatePurchaseOrder);

router.delete('/delete/:id', purchaseOrderController.deletePurchaseOrder);

module.exports = router;
