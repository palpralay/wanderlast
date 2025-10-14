//-------------------------------importing modules--------------------------------
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError.js");
const listing = require("./models/listing.js");
const listingSchema = require("./schema.js");
//--------------------------------------------------------------------------------

//-------------------------------connected to mongoDB-----------------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
//--------------------------------------------------------------------------------

//-------------------------------middleware---------------------------------------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//--------------------------------------------------------------------------------

//-------------------------------RESTful routes-----------------------------------
app.get("/", (req, res) => {
  res.send("working");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

//----index route to show all listings---------------------------------------------
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index", { allListing });
  })
);

//--------New route to create a listing-------------------------------------------
app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});

app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  })
);

//----show route to show details of a specific listing----------------------------
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show", { listing });
  })
);

//-----Edit route to edit a specific listing---------------------------------------
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit", { listing });
  })
);

//-----Update route to update a specific listing-----------------------------------
app.put(
  "/listing/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (req.body.listing.image && typeof req.body.listing.image === "string") {
      req.body.listing.image = { url: req.body.listing.image };
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
  })
);

//-----Delete route to delete a specific listing-----------------------------------
app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    res.redirect("/listing");
  })
);
//--------------------------------------------------------------------------------

//-----------------------------handling 404 error---------------------------------
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
//--------------------------------------------------------------------------------

//-----------------------------error handling-------------------------------------
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { statusCode, message });
});
//--------------------------------------------------------------------------------

//-------------------------------server listening---------------------------------
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
