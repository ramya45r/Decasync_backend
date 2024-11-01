const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        orderQty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        packingUnit: { type: String, required: true },

        discount: { type: Number, default: 0 },
        itemAmount: { type: Number, required: true }, 
        netAmount: { type: Number, required: true }, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
