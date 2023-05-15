const mongoose = require("mongoose");

const url = `mongodb+srv://harsh:${'harshsaid12'}@cluster0.ewp4rx8.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successfull");
  })
  .catch((err) => console.log("db not connected"));