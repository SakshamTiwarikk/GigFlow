import Gig from "../models/Gig.js";

export const getGigs = async (req, res) => {
  const search = req.query.search || "";
  const gigs = await Gig.find({
    status: "open",
    title: { $regex: search, $options: "i" }
  });
  res.json(gigs);
};

export const createGig = async (req, res) => {
  const gig = await Gig.create({
    ...req.body,
    ownerId: req.user._id
  });
  res.status(201).json(gig);
};
