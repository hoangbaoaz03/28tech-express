const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");

const systemConfig = require("../../config/system");
//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");

  for(const record of records){
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role = role.title;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sach tai khoan",
    records: records,
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tao moi tai khoan tai khoan",
    roles: roles,
  });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", "Email existed!");
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    req.flash("success", "Create account successfully!");

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
