const express = require('express');
const { config } = require('dotenv');
const dbconfig = require("./Config/db");
const cors = require("cors");
const fs = require('fs');
const https = require('https');



config(); 

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// app.use('/api', CategoryRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
