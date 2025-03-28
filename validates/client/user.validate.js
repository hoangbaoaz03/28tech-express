module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Please enter the fullName");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Please enter the email");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Please enter the password");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Please enter the fullName");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Please enter the email");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Please enter the email");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Please enter the password");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Please enter the email");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.otpPassword = (req, res, next) => {
  if (!req.body.otp) {
    req.flash("error", "Please enter the otp");
    res.redirect("back");
    return;
  }
  
  if (req.body.otp.length != 6) {
    req.flash("error", "Please enter a 6-digit OTP");
    res.redirect("back");
    return;
  }

  next();
};

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", "Please enter password");
    res.redirect("back");
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", "Please enter confirmPassword");
    res.redirect("back");
    return;
  }

  if(req.body.confirmPassword != req.body.password){
    req.flash("error", "Password and Confirm Password should be same");
    res.redirect("back");
    return;
  }
  next();
};

