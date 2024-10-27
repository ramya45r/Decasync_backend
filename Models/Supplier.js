const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierNo: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },
  },
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  taxNo: {
    type: String,
    required: [true, 'Tax number is required'],
    unique: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function (v) {
        return /^[0-9]{10,15}$/.test(v); 
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blocked'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Supplier', supplierSchema);
