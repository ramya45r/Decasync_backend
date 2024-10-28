const Item = require('../Models/Item');
const Supplier = require('../Models/Supplier');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.body.supplierId);
    if (!supplier || supplier.status !== 'Active') {
      return res.status(400).json({ message: 'Supplier must be active and exist in the system' });
    }

    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('supplierId', 'name'); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('supplierId', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item', error });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  try {
    if (req.body.supplierId) {
      const supplier = await Supplier.findById(req.body.supplierId);
      if (!supplier || supplier.status !== 'Active') {
        return res.status(400).json({ message: 'Supplier must be active and exist in the system' });
      }
    }

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('supplierId', 'name');
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error });
  }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};
