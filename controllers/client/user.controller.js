const User = require("../../models/user.model");

const md5 = require("md5");

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
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if(!user){
    req.flash("error", "Email is not exist!");
    res.redirect("back")
    return
  }

  if(md5(password) !== user.password){
    req.flash("error", "Password is not correct!");
    res.redirect("back")
    return
  }

  if(user.status === "inactive"){
    req.flash("error", "Your account is locked!");
    res.redirect("back")
    return
  }

  res.cookie("tokenUser", user.tokenUser)

  req.flash("success", "Login successful")

  res.redirect("/")
};

// [GET] /user/register
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser")
  res.redirect("/")
};