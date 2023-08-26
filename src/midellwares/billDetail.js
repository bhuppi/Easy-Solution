let cartModel = require("../models/cartModel");
let userModel = require("../models/userModel");
let couponModel = require("../models/couponModel");
let taxModel = require("../models/taxModel");
let membershipModel = require("../models/memberShipModel");

// ========================= Date Check ========================= ||

function isDateInRange(startDate, endDate) {
  let parsedStartDate = new Date(startDate);
  let parsedEndDate = new Date(endDate);
  let currentDate = new Date();
  if (
    parsedEndDate >= parsedStartDate &&
    parsedStartDate <= currentDate &&
    parsedStartDate.getFullYear() === currentDate.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}

// ========================= Bill Detail ========================= ||

exports.billDetail = async (req, res, next) => {
  let obj = {};
  if (req.params.customerId) {
    obj.customerId = req.User._id;
  }
  let netAmount = 0;
  let membershipDiscount = 0;
  let membershipDiscountPercent = 0;
  let membershipId;
  let orderTotal = 0;
  let taxId;
  let taxPercentage = 0;
  let couponCode;
  let couponDiscount = 0;
  let totalOfferDiscount = 0;
  // console.log(req.params.customerId)
  let Cart = await cartModel
    .find(obj)
    .populate({ path: "productId", populate: "taxId" });
  let User = await userModel.findOne({ _id: req.params.customerId });
  //  tax jjjj
  let tax = await taxModel.findOne();
  let coupon = await couponModel.findOne({ couponCode: req.query.couponCode });
  if (!Cart.length) {
    return res
      .status(400)
      .json({ success: false, message: "Cart Not Found" });
  }
  // console.log(Cart)
  let taxPercent = tax.taxPercent / 100;
  let totalPrice = 0;
  let total = 0;
  let price = 0;
  for (let i = 0; i < Cart.length; i++) {
    // console.log(Cart[i].price)
    // console.log(Cart[i].productId.taxId.taxPercent)
    totalPrice += (Cart[i].price * Cart[i].productId.taxId.taxPercent) / 100;
    // console.log(totalPrice)
    price += Cart[i].price;
    total = totalPrice + price;
  }
  // console.log(User);
  if (User?.membership?.discountPercent != undefined) {
    const isInRange = isDateInRange(
      User.membership.startDate,
      User.membership.endDate
    );
    if (!isInRange) {
      req.message = "Membership Is Expair.."
      req.netAmount = price;
      req.orderTotal = Math.ceil(total);
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      req.success = false
      next();
    }
    req.membershipId = User.membership.membershipId;
    req.membershipDiscountPercent = User.membership.discountPercent;
    req.membershipDiscount = (total * User.membership.discountPercent) / 100;
    req.netAmount = price;
    req.orderTotal = Math.ceil(total - req.membershipDiscount);
    req.taxAmount = totalPrice;
    req.success = true
    req.taxPercentage = tax.taxPercent;
    req.totalOfferDiscount = (total * User.membership.discountPercent) / 100;
    req.Cart = Cart;
    next();
  }
  if (req.query.membership == "true") {
    let Membership = await membershipModel.findOne();
    req.membershipId = Membership._id;
    req.membershipDiscountPercent = Membership.discountPercent;
    req.membershipDiscount = (total * Membership.discountPercent) / 100;
    req.netAmount = price + Membership.price;
    req.orderTotal = Math.ceil(
      total - req.membershipDiscount + Membership.price
    );
    req.taxAmount = totalPrice;
    req.success = true
    req.taxPercentage = tax.taxPercent;
    req.totalOfferDiscount = (total * Membership.discountPercent) / 100;
    req.Cart = Cart;
    next();
  }
  if (req.query.membershipId) {
    let Memberships = await membershipModel.findOne({
      _id: req.query.membershipId,
    });
    req.success = true
    req.membershipId = Memberships._id;
    req.membershipDiscountPercent = Memberships.discountPercent;
    req.membershipDiscount = (total * Memberships.discountPercent) / 100;
    req.netAmount = price + Memberships.price;
    req.orderTotal = Math.ceil(
      total - req.membershipDiscount + Memberships.price
    );
    // req.taxId = tax._id;
    req.taxAmount = totalPrice;
    req.taxPercentage = tax.taxPercent;
    req.totalOfferDiscount = (total * Memberships.discountPercent) / 100;
    req.Cart = Cart;
    next();
  }
  if (req.query.couponCode && User.membership.discountPercent == undefined) {
    if (!coupon) {
      req.message = `Coupon Not Found`;
      req.netAmount = price;
      req.success = false
      req.orderTotal = Math.ceil(total);
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      next();
    }
    if (coupon.disable == true) {
      req.message = "Coupon Is Not Apply";
      req.netAmount = price;
      req.orderTotal = Math.ceil(total);
      req.success = false
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      next();
    }
    const isInRange = isDateInRange(coupon.startDate, coupon.expiryDate);
    if (!isInRange) {
      req.message = `Coupon Is Expair..`;
      req.netAmount = price;
      req.success = false
      req.orderTotal = Math.ceil(total);
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      next();
    }
    if (total <= coupon.minOrderPrice) {
      req.message = `Coupon Is Not Apply Because MinmumOrderPrice ${coupon.minOrderPrice}`;
      req.netAmount = price;
      req.orderTotal = Math.ceil(total);
      req.success = false
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      next();
    }
    if (coupon.couponQuantity == 0) {
      req.message = `Coupon Is Not Apply Because couponQuantity ${coupon.couponQuantity}`;
      req.netAmount = price;
      req.orderTotal = Math.ceil(total);
      req.success = false
      req.taxAmount = totalPrice;
      req.taxPercentage = tax.taxPercent;
      req.Cart = Cart;
      next();
    } else {
      let a = [];
      for (let t = 0; t < Cart.length; t++) {
        if (coupon.categoryId.includes(Cart[t].productId.categoryId)) {
          a.push(t);
        }
      }
      if (a.length > 0) {
        let discount = (total * coupon.couponPercent) / 100;
        if (discount > coupon.maxDiscountPrice) {
          req.message = "Coupon Apply";
          req.success = true
          req.couponDiscount = coupon.maxDiscountPrice;
          req.netAmount = price;
          req.orderTotal = Math.ceil(total - req.couponDiscount);
          // req.taxId = tax._id;
          req.taxAmount = totalPrice;
          req.taxPercentage = tax.taxPercent;
          req.couponCode = coupon.couponCode;
          req.totalOfferDiscount = req.couponDiscount;
          req.Cart = Cart;
          next();
        }
        if (discount < coupon.maxDiscountPrice) {
          req.message = "Coupon Apply";
          req.couponDiscount = discount;
          req.netAmount = price;
          req.success = true
          req.orderTotal = Math.ceil(total - req.couponDiscount);
          // req.taxId = tax._id;
          req.taxAmount = totalPrice;
          req.taxPercentage = tax.taxPercent;
          req.couponCode = coupon.couponCode;
          req.totalOfferDiscount = req.couponDiscount;
          req.Cart = Cart;
          next();
        }
      }
      // console.log(a)
      if (a.length == 0) {
        // console.log("KKKKk")
        req.message = "Coupon Is Not Apply";
        req.netAmount = price;
        req.orderTotal = Math.ceil(total);
        req.success = false
        req.taxAmount = totalPrice;
        req.taxPercentage = tax.taxPercent;
        req.Cart = Cart;
        next();
      }
    }
  }
  if (
    req.query.membership == "false" ||
    (!req.query.membership &&
      !User.membership.discountPercent &&
      !req.query.membershipId &&
      !req.query.couponCode)
  ) {
    req.netAmount = price;
    req.orderTotal = Math.ceil(total);
    req.taxAmount = totalPrice;
    req.taxPercentage = tax.taxPercent;
    req.Cart = Cart;
    next();
  }
};
