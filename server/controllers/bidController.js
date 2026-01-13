import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

export const createBid = async (req, res) => {
  const bid = await Bid.create({
    ...req.body,
    freelancerId: req.user._id
  });
  res.status(201).json(bid);
};

export const getBidsForGig = async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId });
  res.json(bids);
};

export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const bid = await Bid.findById(req.params.bidId).session(session);
  const gig = await Gig.findOne({ _id: bid.gigId, status: "open" }).session(session);

  if (!gig) throw new Error("Gig already assigned");

  await Gig.updateOne(
    { _id: gig._id },
    { status: "assigned" }
  ).session(session);

  await Bid.updateOne(
    { _id: bid._id },
    { status: "hired" }
  ).session(session);

  await Bid.updateMany(
    { gigId: gig._id, _id: { $ne: bid._id } },
    { status: "rejected" }
  ).session(session);

  await session.commitTransaction();

  // 🔔 Socket Notification
  const io = req.app.get("io");
  io.to(bid.freelancerId.toString()).emit("hired", {
    message: "You have been hired!"
  });

  res.json({ message: "Freelancer hired successfully" });
};
