import cloudinary from "../lib/cloudinary.js";
import { comparePassword, hashPassword } from "../lib/hashPass.js";
import { generateToken } from "../lib/utils.js";
import AccountDb from "../model/account.model.js";
import UserDb from "../model/user.model.js";
import { loginSchema, signUpSchema, updateBody } from "../zod/user.zod.js";


// Update User Routes
export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await UserDb.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const checkPass = await comparePassword(oldPassword, user.password);
    if (!checkPass) {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await UserDb.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const updateProfileImage = async (req, res) => {
  const { profileImg } = req.body;
  const userId = req.user._id;

  try {
    if (!profileImg) {
      const updateUser = await UserDb.findByIdAndUpdate(
        userId,
        { profileImg: "" },
        { new: true }
      ).select("-password -__v");
      return res.status(200).json({
        message: "Profile image removed successfully",
        success: true,
        user: updateUser,
      });
    }

    const updateRes = await cloudinary.uploader.upload(profileImg);
    const updateUser = await UserDb.findByIdAndUpdate(
      userId,
      { profileImg: updateRes.secure_url },
      { new: true }
    ).select("-password -__v");
    res.status(200).json({
      message: "Profile image upload successfull",
      success: true,
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const updateUserDetails = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const userId = req.user._id;

  try {
    const { success, error } = updateBody.safeParse({
      email: email ? email : null,
      firstName: firstName ? firstName : null,
      lastName: lastName ? lastName : null,
    });
    if (!success) {
      return res.status(411).json({
        message: "Invalid input data",
        success: false,
        error: error,
      });
    }

    const user = await UserDb.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const updateUser = await UserDb.findByIdAndUpdate(
      userId,
      {
        firstName: firstName ? firstName : user.firstName,
        lastName: lastName ? lastName : user.lastName,
        email: email ? email : user.email,
      },
      { new: true }
    ).select("-password -__v");

    if (!updateUser) {
      return res.status(400).json({
        message: "User update failed",
        success: false,
      });
    }

    res.status(200).json({
      message: "User details updated successfully",
      success: true,
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};

// Get Users Routes
export const users = async (req, res) => {
  const filter = req.query.filter || "";

  try {
    if (filter) {
      const filterUsers = await UserDb.find({
        $or: [
          {
            firstName: { $regex: filter, $options: "i" },
          },
          {
            lastName: { $regex: filter, $options: "i" },
          },
        ],
      }).select("-password -__v");

      return res.status(200).json({
        message: "Filter users fetch successfull",
        success: true,
        user: filterUsers,
      });
    }

    const allUsers = await UserDb.find().select("-password -__v");
    res.status(200).json({
      message: "All users fetch successfull",
      success: true,
      user: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const checkUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "User fetch successfull",
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};

// Login, SignUp and Logout Routes
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { success, error } = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!success) {
      return res.status(401).json({
        message: "Invalid input data",
        success: false,
        error: error,
      });
    }

    const user = await UserDb.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found / Try to SignUp first",
        success: false,
      });
    }

    const checkPass = await comparePassword(password, user.password);
    if (checkPass) {
      generateToken(user, res);

      return res.status(201).json({
        message: "User login successfully",
        success: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImg: user.profileImg,
        },
      });
    } else {
      return res.status(400).json({
        message: "Password is incorrect",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const { success, error } = signUpSchema.safeParse({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    if (!success) {
      return res.status(401).json({
        message: "Invalid input data",
        success: false,
        error: error,
      });
    }

    const isUserExist = await UserDb.findOne({ email });
    if (isUserExist) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserDb({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const newAccount = new AccountDb({
      userId: newUser,
      balance: (Math.random() * 10000 + 1).toFixed(2),
    });

    if (newUser) {
      generateToken(newUser, res);
      await newUser.save();
      await newAccount.save();

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profileImg: newUser.profileImg,
        },
      });
    } else {
      return res.status(401).json({
        message: "User creation failed",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfull",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};
