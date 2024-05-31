const Listing = require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author",},}).populate("owner");
    if (!listing) {
        req.flash("error","Listing you requested for does  exist!");
        res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.createListing=async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing you requested for does  exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

