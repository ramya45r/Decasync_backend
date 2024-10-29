const express = require('express');
const purchaseOrderController = require('../Controllers/purchaseorderController');
const router = express.Router();

// Route to create a new purchase order
router.post('/', purchaseOrderController.createPurchaseOrder);

// Route to get all purchase orders
router.get('/', purchaseOrderController.getAllPurchaseOrders);

// Route to get a single purchase order by ID
router.get('/:id', purchaseOrderController.getPurchaseOrderById);

// Route to update a purchase order by ID
router.put('/update/:id', purchaseOrderController.updatePurchaseOrder);

// Route to delete a purchase order by ID
router.delete('/delete/:id', purchaseOrderController.deletePurchaseOrder);

module.exports = router;
