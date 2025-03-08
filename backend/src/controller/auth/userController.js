import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken from "../../helpers/hashToken.js";
import { link, rmSync } from "node:fs";
import sendEmail from "../../helpers/sendEmail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    // 400 Bad Request
    res.status(400).json({ message: "All fields are required" });
  }

  // check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // bad request
    return res.status(400).json({ message: "User already exists" });
  }

  // create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // generate token with user id
  console.log(user._id);
  const token = generateToken(user._id);
  console.log(token);

  // send back the user and token in the response to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none", // cross-site access --> allow all third-party cookies
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    // 201 Created
    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  // check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // generate token with user id
  console.log(userExists._id);
  const token = generateToken(userExists._id);
  console.log(token);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    // set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none", // cross-site access --> allow all third-party cookies
      secure: true,
    });

    // send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  }
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

// get user
export const getUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  //get user details from token -> protect middleware
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    //update user properties\
    const { name, bio, photo } = req.body;
    //update user properties
    user.name = req.body.name || req.name;
    user.bio = req.body.bio || req.bio;
    user.photo = req.body.photo || req.photo;

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      photo: updated._id,
      bio: updated.bio,
      isVerified: updated.isVerified,
    });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});

export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authorized. Please login" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    return res.status(200).json(true);
  }
  return res.status(401).json(false);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }

  //check verification
  if (user.isVerified) {
    return res.status(400).json({ message: "User already Verified" });
  }

  let token = await Token.findOne({ userId: user._id });

  //is there delete the existing one
  if (token) {
    await token.deleteOne();
  }

  //create new token (verification) --> crypto
  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  //hash the verification token

  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }).save();

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  //send email
  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const reply_to = "noreply@gmailcom";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const link = verificationLink;

  try {
    await sendEmail(
      send_to,
      send_from,
      name,
      subject,
      template,
      reply_to,
      link
    );
    return res.status(200).json({ message: "Verification Email Sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});

//verify user

export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid Verificaton Token" });
  }

  const hashedToken = hashToken(verificationToken);

  //find user
  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    //check expiry
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification Token" });
  }
  const user = await User.findById(userToken.userId);

  if (user.isVerified) {
    return res.status(400).json({ message: "User already Verified!" });
  }

  //update verification
  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified!" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email Required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not Found!" });
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  //create reset token --> expires in 1hr

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  //hash the token

  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  }).save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  //send email to user

  const subject = "Password Reset - AuthKit";
  const send_to = user.email;
  const reply_to = "noreply@gmailcom";
  const template = "forgotPassword";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const link = resetLink;

  try {
    await sendEmail(
      send_to,
      send_from,
      name,
      subject,
      template,
      reply_to,
      link
    );
    return res.status(200).json({ message: "Password reset Email Sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Enter Password" });
  }

  //hash reset token
  const hashedToken = hashToken(resetPasswordToken);

  //check id token exist

  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    //check expiry
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Invalid or Expired reset Token" });
  }

  const user = await User.findById(userToken.userId);

  //update password

  user.password = password;

  await user.save();
  return res.status(200).json({ message: "Password Reset Succesfull" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All Fields are Requires!" });
  }
  //fnd user by id
  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  //resetpassword
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Password Changed Successfully" });
});
