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
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  //Het lay ra san pham noi bat

  //Lay ra san pham moi nhat
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
    const newProductsNew = productsHelper.priceNewProducts(productsNew);
  //Het lay ra san pham moi nhat

  res.render("client/pages/home/index", {
    pageTitle: "Trang chu",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
