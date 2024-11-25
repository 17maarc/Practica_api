const mongoose = require("mongoose");

const webpageSchema = new mongoose.Schema({
  city: { type: String, required: true },
  activity: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  texts: { type: [String], required: true },
  images: { type: [String], required: true },
  reviews: {
    scoring: { type: Number, min: 0, max: 5, default: 0 },
    totalRatings: { type: Number, default: 0 },
    reviewTexts: { type: [String] },  
    individualScores: { type: [Number], default: [] }, 
  },
  commerce: { type: mongoose.Schema.Types.ObjectId, ref: "commerceModel", required: false },
});

webpageSchema.methods.addReview = async function (score, text) {
  if (score < 1 || score > 5) {
    throw new Error("La puntuación debe estar entre 1 y 5.");
  }

  this.reviews.individualScores.push(score);
  this.reviews.reviewTexts.push(text);

  const totalScores = this.reviews.individualScores.reduce((sum, val) => sum + val, 0);
  this.reviews.totalRatings = this.reviews.individualScores.length;
  this.reviews.scoring = totalScores / this.reviews.totalRatings;

  await this.save();
};

module.exports = mongoose.model("Webpage", webpageSchema);