const PurchaseOrder = require('../Models/PurchaseOrder');
const PurchaseOrderItem = require('../Models/PurchaseOrderItem');
const Supplier = require('../Models/Supplier');

// Create a new Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    let itemTotal = 0;
    let discount = 0;

    for (const item of items) {
      const { unitPrice, orderQty, discount: itemDiscount } = item;
      const itemAmount = unitPrice * orderQty;
      itemTotal += itemAmount;
      discount += itemDiscount || 0;
    }

    const netAmount = itemTotal - discount;

    // Create the purchase order
    const purchaseOrder = new PurchaseOrder({
      supplierId,
      itemTotal,
      discount,
      netAmount,
    });

    await purchaseOrder.save();

    // Save each item in PurchaseOrderItem collection
    for (const item of items) {
      const { itemId, stockUnit, unitPrice, packingUnit, orderQty, discount: itemDiscount } = item;
      const itemAmount = unitPrice * orderQty;
      const netAmount = itemAmount - (itemDiscount || 0);

      const purchaseOrderItem = new PurchaseOrderItem({
        purchaseOrderId: purchaseOrder._id,
        itemId,
        stockUnit,
        unitPrice,
        packingUnit,
        orderQty,
        itemAmount,
        discount: itemDiscount || 0,
        netAmount,
      });

      await purchaseOrderItem.save();
    }

    res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Purchase Orders
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().populate('supplierId');
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Purchase Order by ID
exports.getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate('supplierId');

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    const purchaseOrderItems = await PurchaseOrderItem.find({ purchaseOrderId: purchaseOrder._id });
    res.status(200).json({ purchaseOrder, purchaseOrderItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Purchase Order
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    // Calculate itemTotal, discount, and netAmount
    let itemTotal = 0;
    let discount = 0;

    for (const item of items) {
      const { unitPrice, orderQty, discount: itemDiscount } = item;
      const itemAmount = unitPrice * orderQty;
      itemTotal += itemAmount;
      discount += itemDiscount || 0;
    }

    const netAmount = itemTotal - discount;

    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { supplierId, itemTotal, discount, netAmount },
      { new: true }
    );

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // Update PurchaseOrderItems
    await PurchaseOrderItem.deleteMany({ purchaseOrderId: purchaseOrder._id });
    for (const item of items) {
      const { itemId, stockUnit, unitPrice, packingUnit, orderQty, discount: itemDiscount } = item;
      const itemAmount = unitPrice * orderQty;
      const netAmount = itemAmount - (itemDiscount || 0);

      const purchaseOrderItem = new PurchaseOrderItem({
        purchaseOrderId: purchaseOrder._id,
        itemId,
        stockUnit,
        unitPrice,
        packingUnit,
        orderQty,
        itemAmount,
        discount: itemDiscount || 0,
        netAmount,
      });

      await purchaseOrderItem.save();
    }

    res.status(200).json({ message: 'Purchase Order updated successfully', purchaseOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Purchase Order
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // Delete related PurchaseOrderItems
    await PurchaseOrderItem.deleteMany({ purchaseOrderId: purchaseOrder._id });

    res.status(200).json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
