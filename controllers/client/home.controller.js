const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  //Lay ra san pham noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);
  //Het lay ra san pham noi bat

  const newProducts = productsHelper.priceNewProduct(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chu",
    productsFeatured: newProducts,
  });
};
