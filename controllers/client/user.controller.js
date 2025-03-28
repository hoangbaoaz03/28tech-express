const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const md5 = require("md5");

const generateHelper = require("../../helpers/generate");
const sendEmailHelper = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Trang dang ky",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    status: "active",
  });

  if (existEmail) {
    req.flash("error", "Email existed, please try again");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};

// [GET] /user/register
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Trang dang nhap",
  });
};

// [POST] /user/register
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email is not exist!");
    res.redirect("back");
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Password is not correct!");
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Your account is locked!");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Login successful");

  res.redirect("/");
};

// [GET] /user/register
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lay lai mat khau",
  });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email is not exist!");
    res.redirect("back");
    return;
  }
  //Luu thong tin vao database
  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Neu ton tai email thi gui ma otp qua email
  const subject = "Ma OTP xac minh lay lai mat khau";
  const html = `
    Ma OTP de lay lai mat khau la <b style="color: green;">${otp}</b>. Thoi han su dung la 3 phut  
  `;
  sendEmailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

//[GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhap ma OTP",
    email: email,
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "The OTP is incorrect.");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Doi mat khau",
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  req.flash("Doi mat khau thanh cong");

  res.redirect("/");
};
