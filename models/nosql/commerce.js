const mongoose = require("mongoose");

const commerceScheme = new mongoose.Schema( //Aquí basicamente encontramos el esquema de lo que tiene que llevar cada comercio
  {
    name: {
      type: String,
    },

    cif: {
      type: String,
      unique: true,
    },

    jwt: {
      type: String,
    },

    address: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    phone: {
      type: String,
      unique: true,
    },

    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("commerce", commerceScheme);