const mongoose = require("mongoose");

const forgotPaswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 120,
    }
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPaswordSchema, "forgot-password");

module.exports = ForgotPassword;
