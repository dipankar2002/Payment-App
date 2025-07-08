
import AccountDb from "../model/account.model.js";

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
