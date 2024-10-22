const mongoose = require("mongoose");

const webpageSchema = new mongoose.Schema({ //Aquí basicamente encontramos el esquema de lo que tiene que llevar cada web
  city: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  texts: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  reviews: {
    scoring: {
      type: Number,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    reviewTexts: {
      type: [String],
    },
  },
});

module.exports = mongoose.model("Webpage", webpageSchema);