const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products")

//[GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regax = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regax,
      deleted: false,
      status: "active"
    });
    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    pageTitle: "Ket qua tim kiem",
    keyword: keyword,
    products: newProducts,
  });
};
