const cartModel = require("../../models/ecommerce/CartModel");
const productModel = require("../../models/ecommerce/productModel");

exports.getCartId = async (req, res, next, id) => {
  try {
    let cart = await cartModel.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart Not Found",
      });
    } else {
      (req.Cart = cart), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================= Create Cart ============================ ||

exports.createCart = async (req, res) => {
  try {
    const data = req.body;
    if (!data.customerId) {
      return res
        .status(400)
        .json({ success: false, message: "customerId Is Required..." });
    }
    if (!data.productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId Is Required..." });
    }
   
    let a = await cartModel.findOne({
      customerId: req.body.customerId,
      productId: req.body.productId,
    });
    if (a) {
      return res.status(200).json({
        success: true,
        message: "This Product Is All Ready In You Cart",
      });
    } else {
      let Product = await productModel.findOne({ _id: data.productId });
      // if (Product.quantity == 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Product Is Sold Out",
      //   });
      // }
      let price = Product.price * 1;
      let Cart = await cartModel.create({
        price: price,
        customerId: data.customerId,
        productId: data.productId,
      });
      return res.status(201).json({
        success: true,
        message: "Add To Cart Successfuly...",
        data: Cart,
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ============================ Get All Cart By User Id ========================= ||

exports.getAllCartBycustomerId = async (req, res) => {
  try {
    const billDetail = {};
    billDetail.netAmount = req.netAmount;
    billDetail.membershipDiscount = req.membershipDiscount;
    billDetail.membershipDiscountPercent = req.membershipDiscountPercent;
    billDetail.membershipId = req.membershipId;
    billDetail.orderTotal = req.orderTotal;
    billDetail.taxId = req.taxId;
    billDetail.taxPercentage = req.taxPercentage;
    billDetail.couponCode = req.couponCode;
    billDetail.couponDiscount = req.couponDiscount;
    billDetail.totalOfferDiscount = req.totalOfferDiscount;
    billDetail.message = req.message;
    return res.status(200).send({
      success: true,
      isSuccess: req.success,
      message: "cart fetched successfully",
      isMessage: req.message,
      data: { cartData: req.Cart, billDetail: billDetail },
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.quantityUpdate = async (req, res) => {
  try {
    let Cart = req.Cart;
    console.log(Cart)
    let updateCart = await cartModel
      .findOneAndUpdate(
        { _id: req.Cart._id },
        {
          $set: {
            quantity: Cart.quantity + 1,
            price: Cart.price * (Cart.quantity + 1),
          },
        },
        { new: true }
      )
      .populate("productId");
    return res.status(200).json({
      success: true,
      message: "Quantity Update Successfully...",
      data: updateCart,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.removeQuantity = async (req, res) => {
  try {
    let Cart = req.Cart;
    if (Cart.quantity > 1) {
      let updateCart = await cartModel
        .findOneAndUpdate(
          { _id: req.Cart._id },
          {
            $set: {
              quantity: Cart.quantity - 1,
              price: Cart.price * (Cart.quantity - 1),
            },
          },
          { new: true }
        )
        .populate("productId");
      return res.status(200).send({
        success: true,
        message: "Cart Updated Successfully",
        data: updateCart,
      });
    } else {
      await cartModel.findOneAndDelete({ _id: req.Cart._id });
      return res.status(200).json({
        success: true,
        message: "Cart Is Successfully Delete...",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCustomerCart = async (req, res) => {
  try {
    let Cart = await cartModel.find({ customerId: req.User._id });
    if (!Cart.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Not Found" });
    }
    let updateCart = await cartModel.deleteMany({
      customerId: req.params.customerId,
    });
    return res.status(200).json({
      success: true,
      message: "Cart Delete Successfully.....",
      data: updateCart,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteCartById = async (req, res) => {
  try {
    let Cart = await cartModel.findOne({ _id: req.Cart._id });
    if (!Cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Not Found" });
    }
    let updateCart = await cartModel.deleteOne({ _id: req.params.cartId });
    return res.status(200).json({
      success: true,
      message: "Cart Delete Successfully.....",
      data: updateCart,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
