import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

const TransactionDb = mongoose.model("Transaction", transactionSchema);

export default TransactionDb;