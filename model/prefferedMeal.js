const mongoose = require("mongoose");

const preffered = mongoose.Schema({
    mess_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messModel"
    },
    meal_name: {
        type: String,
    }
})

module.exports = new mongoose.model("prefferedMeal", preffered);