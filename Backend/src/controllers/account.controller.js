import mongoose from "mongoose";
import AccountDb from "../model/account.model.js";
import TransactionDb from "../model/transaction.model.js";

export const transfer = async (req, res) => {
  const session = await mongoose.startSession();

  const { amount, toAccount } = req.body;
  const userId = req.user._id;

  try {
    session.startTransaction();
    const account = await AccountDb.findOne({ userId: userId }).session(
      session
    );
    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Account not found",
        success: false,
      });
    }
    if (account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
        success: false,
      });
    }

    const receiverAccount = await AccountDb.findOne({
      userId: toAccount,
    }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Receiver account not found",
        success: false,
      });
    }

    await AccountDb.updateOne(
      { userId: userId },
      { $inc: { balance: -amount.toFixed(2) } }
    ).session(session);
    await AccountDb.updateOne(
      { userId: toAccount },
      { $inc: { balance: amount.toFixed(2) } }
    ).session(session);

    const newTransaction = new TransactionDb({
      senderId: userId,
      receiverId: toAccount,
      amount: amount,
    });
    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Transfer successful",
      success: true,
      transaction: newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getTransactionHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await TransactionDb.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).select("-__v");

    res.status(200).json({
      message: "Transaction history retrieved successfully",
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const getAccountBalance = async (req, res) => {
  const userId = req.user._id;

  try {
    const account = await AccountDb.findOne({ userId: userId }).select(
      "-userId -_id -__v"
    );
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Account balance retrieved successfully",
      success: true,
      accountBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
