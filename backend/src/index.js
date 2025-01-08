const express = require("express");
const cors = require('cors');
const multer = require("multer")

const app = express();
const PORT = process.env.PORT || 3001;

const v01Router = require("./v0.1/routes");

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

app.use("/api/v0.1", v01Router);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});