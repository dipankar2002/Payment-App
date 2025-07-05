
import { comparePassword, hashPassword } from "../lib/hashPass.js";
import { generateToken } from "../lib/utils.js";
import AccountDb from "../model/account.model.js";
import UserDb from "../model/user.model.js";
import { loginSchema, signUpSchema, updateBody } from "../zod/user.zod.js";


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
