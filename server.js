const express = require('express');
const { config } = require('dotenv');
const dbconfig = require("./Config/db");
const cors = require("cors");
const fs = require('fs');
const https = require('https');
const supplierRoutes = require('./Routes/suppliersRoutes');
const itemRoutes = require('./Routes/itemsRoutes');
const purchaseOrderRoutes = require('./Routes/purchaseOrderRoutes');



config(); 

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
