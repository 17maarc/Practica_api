// En models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ //modelo de los users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    interests: { type: [ String ]},
    offers: {type: Boolean, default: true},
    role: { type: String,
            enum: ['user', 'admin'], 
            default: "user" },
});

module.exports = mongoose.model("users", userSchema);