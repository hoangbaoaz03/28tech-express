const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProduct(products);

  res.render("client/pages/products/index", {
    pageTitle: "Trang danh sach san pham",
    products: newProducts,
  });
};

//[GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

//[GET] /products/:slug
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });

  const listSubCategory = await productsCategoryHelper.getSubCategory(
    category.id
  );

  const listSubCategoryId = listSubCategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products,
  });
};
