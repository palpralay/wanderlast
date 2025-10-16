const mongoose = require("mongoose");
const schema = mongoose.Schema;
const link = "https://afar.brightspotcdn.com/dims4/default/5e0f8f5/2147483647/strip/true/crop/5760x3056+0+0/resize/1440x764!/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F0e%2Fe0%2F2d5cbb2139b753c565850eda5611%2Foriginal-amsterdam-the-netherlands-canals-copy.jpg";

const listingSchema = new schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default: link,
      set: (v) => (v === "" ? link : v),
    },
  },
  price: { type: Number },
  location: { type: String },
  country: { type: String },
  reviews : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
