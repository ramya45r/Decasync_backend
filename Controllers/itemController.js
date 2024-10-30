const Item = require('../Models/Item');
const Supplier = require('../Models/Supplier');

exports.createItem = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.body.supplierId);
 
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('supplierId', 'name'); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};

exports.singlesupplieritem = async (req, res) => {
  try {
    const { supplierId } = req.query;
    if (!supplierId) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }

    const items = await Item.find({ supplierId });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('supplierId', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item', error });
  }
};

exports.updateItem = async (req, res) => {
  try {
   

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

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};
