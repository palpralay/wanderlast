const joi = require("joi");
const listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().min(0).required(),
    image: joi.object({
      url: joi.string().allow("", null)
    }).optional(),
    country: joi.string().required(),
    location: joi.string().required()
  }).required()
});
module.exports = listingSchema;