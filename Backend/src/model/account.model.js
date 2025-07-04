import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

const AccountDb = mongoose.model("Account", accountSchema);

export default AccountDb;