const PurchaseOrder = require('../Models/PurchaseOrder');
const PurchaseOrderItem = require('../Models/PurchaseOrderItem');
const Supplier = require('../Models/Supplier');

exports.createPurchaseOrder = async (req, res) => {
  try {

    const items = req.body.items.map((item) => ({
      itemId: item._id,
      orderQty: item.orderQty,
      unitPrice: item.unitPrice,
      discount: item.discount,
      packingUnit: item.packingUnit,
      itemAmount: item.orderQty * item.unitPrice,
      netAmount: item.orderQty * item.unitPrice - item.discount,
    }));
console.log(items,'items');

    const itemTotal = items.reduce((total, item) => total + item.itemAmount, 0);
    const discountTotal = items.reduce((total, item) => total + item.discount, 0);
    const netAmount = itemTotal - discountTotal;

    const purchaseOrder = new PurchaseOrder({
      orderNo: req.body.orderNo,
      orderDate: req.body.orderDate,
      supplierId: req.body.supplierId,
      itemTotal,
      discount: discountTotal,
      
      netAmount,
      items,
    });

    await purchaseOrder.save();

    res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase order', error });
  }
};

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().populate('supplierId').populate('items.itemId');
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

// Update 
exports.updatePurchaseOrder = async (req, res) => {
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

    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { supplierId, itemTotal, discount, netAmount },
      { new: true }
    );

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

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

// Delete 
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    await PurchaseOrderItem.deleteMany({ purchaseOrderId: purchaseOrder._id });

    res.status(200).json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
