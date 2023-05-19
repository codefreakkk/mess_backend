const express = require("express");
const app = express();
const cors = require("cors");
require("./model/dbcon");

const userRoutes = require("./routes/userRoutes");
const messRoutes = require("./routes/messRoutes");

app.use(express.json());
// app.use(cors({credentials: true, origin: ["http://localhost:3000", "http://localhost:3001", "https://devsinfo.vercel.app"]}));
app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1", messRoutes);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server started at ${PORT}`));