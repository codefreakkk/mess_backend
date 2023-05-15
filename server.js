const express = require("express");
const app = express();
const cors = require("cors");
require("./model/dbcon");

const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors({credentials: true, origin: ["http://localhost:3000", "http://localhost:3001", "https://devsinfo.vercel.app"]}));

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server started at ${PORT}`));