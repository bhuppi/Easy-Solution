const orderModel = require("../../models/ecommerce/orderModel");
const cartModel = require("../../models/ecommerce/CartModel");
const productModel = require("../../models/ecommerce/productModel");

function checkStatusConsistency(array1, key) {
  if (array1.length === 0) {
    return false;
  }
  const firstStatus = array1[0][key];
  for (let i = 1; i < array1.length; i++) {
    if (array1[i][key] !== firstStatus) {
      return false;
    }
  }
  return true;
}
function changeValueByKey(array1, key, newValue, value) {
  if (checkStatusConsistency(array1, key) && newValue != "RETURNED") {
    for (let i = 0; i < array1.length; i++) {
      array1[i][key] = newValue;
      value = newValue;
    }
  }
  if (checkStatusConsistency(array1, key) && newValue == "RETURNED") {
    array1 = [];
    value = "RETURNED";
  }
  if(!checkStatusConsistency(array1, key) && newValue != "RETURNED"){
    value = "MULTI_STATUS";
  }
  return value;
}

// ========================== Get Id =================================== ||

exports.getOrderId = async (req, res, next, id) => {
  try {
    let Order = await orderModel.findById(id);
    if (!Order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    } else {
      (req.Order = Order), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Create Order ======================== ||
exports.createOrder = async (req, res) => {
  try {
    const {
      customerId,
      orderTotal,
      tax,
      couponeCode,
      couponeDiscount,
      totalOfferDiscount,
      netAmount,
      memberShipId,
      addressId,
      memberDiscount,
      memberDiscountPercent,
      categoryId,
      paymentMethod,
    } = req.body;
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "CustomerId Is Required...",
      });
    }
    if (!orderTotal) {
      return res.status(400).json({
        success: false,
        message: "orderTotal Is Required...",
      });
    }
    if (!tax) {
      return res.status(400).json({
        success: false,
        message: "tax Is Required...",
      });
    }
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "addressId Is Required...",
      });
    }
    if (!netAmount) {
      return res.status(400).json({
        success: false,
        message: "netAmount Is Required...",
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod Is Required...",
      });
    }
    if (paymentMethod !== "COD" && paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "paymentMethod Only Use (COD && ONLINE)",
      });
    }
    let arr = [];
    let Cart = await cartModel
      .find({ customerId: customerId })
      .populate("productId");
    if (!Cart.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Is Not Found In DB..." });
    }
    for (let i = 0; i < Cart.length; i++) {
      obj = {};
      if (!paymentMethod || paymentMethod != "COD") {
        obj.productId = Cart[i].productId;
        obj.price = Cart[i].price;
        obj.quantity = Cart[i].quantity;
        obj.status = "PENDING";
      } else {
        let a = await productModel.findById({ _id: Cart[i].productId._id });
        await productModel.findByIdAndUpdate(
          { _id: Cart[i].productId._id },
          {
            $set: {
              stock: a.stock - Cart[i].quantity,
              sold: a.sold + Cart[i].quantity,
            },
          },
          { new: true }
        );
        obj.productId = Cart[i].productId;
        obj.price = Cart[i].price;
        obj.quantity = Cart[i].quantity;
        obj.status = "ORDERED";
      }
      arr.push(obj);
    }
    const Order = await orderModel.create({
      customerId: customerId,
      orderTotal: orderTotal,
      tax: tax,
      couponeCode: couponeCode,
      couponeDiscount: couponeDiscount,
      totalOfferDiscount: totalOfferDiscount,
      netAmount: netAmount,
      addressId: addressId,
      product: arr,
      status: paymentMethod == "COD" ? "ORDERED" : "PENDING",
      memberShipId: memberShipId,
      memberDiscount: memberDiscount,
      memberDiscountPercent: memberDiscountPercent,
      categoryId: categoryId,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod == "COD" ? true : false,
    });
    return res.status(200).json({
      success: true,
      message: "Order Is Created Successfully...",
      data: Order,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ================= updateSingleStatus ===============
exports.updateSingleStatus = async (req, res) => {
  try {
    let status = req.body.status;
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status Is Required..." });
    }
    if (
      status != "PENDING" &&
      status != "ORDERED" &&
      status != "OUT_OF_DELIVERY" &&
      status != "DELIVERED" &&
      status != "RETURN_REQUEST" &&
      status != "RETURNED" &&
      status != "RETURN_REQUEST_APPROVED" &&
      status != "CANCELLED" &&
      status != "SHIPPED" &&
      status != "MULTI_STATUS"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "(PENDING || ORDERED || MULTI_STATUS || SHIPPED || RETURN_REQUEST_APPROVED || DELIVERED || CANCELLED || RETURN_REQUEST || OUT_OF_DELIVERY || RETURNED) This Is Valied Status",
      });
    }
    if (!req.query.productId) {
      return res.status(400).json({
        success: false,
        message: "productId Is Required...",
      });
    }
    let statusUpdate;
    if (status == "RETURNED") {
      statusUpdate = await orderModel.findOneAndUpdate(
        {
          _id: req.Order._id,
          "product.productId": req.query.productId,
        },
        { $set: { "product.$.status": req.body.status } },
        { new: true }
      );
      let a = await productModel.findById({
        _id: statusUpdate.product.productId._id,
      });
      await productModel.findByIdAndUpdate(
        { _id: statusUpdate.product.productId._id },
        {
          $set: {
            stock: a.stock + statusUpdate.quantity,
            sold: a.sold - statusUpdate.quantity,
          },
        },
        { new: true }
      );
    } else {
      statusUpdate = await orderModel.findOneAndUpdate(
        {
          _id: req.Order._id,
          "product.productId": req.query.productId,
        },
        { $set: { "product.$.status": req.body.status } },
        { new: true }
      );
    }
    let array1 = req.Order.product;
    console.log("array1",array1)
    let value = "SINGLE";
    value = changeValueByKey(array1, "status", req.body.status, value);
    console.log(value)
    console.log(array1)
    if(value == "RETURNED"){
      array1 = []
    }
    statusUpdate = await orderModel.findOneAndUpdate(
      {
        _id: req.Order._id,
      },
      { $set: { product: array1, status: value  } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status Is Update Successfully...",
      data: statusUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================== Update All status ===================== ||

exports.updateAllProductStatus = async (req, res) => {
  try {
    let array1;
    let status = req.body.status;
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status Is Required..." });
    }
    if (
      status != "OUT_OF_DELIVERY" &&
      status != "DELIVERED" &&
      status != "RETURN_REQUEST" &&
      status != "RETURNED" &&
      status != "RETURN_REQUEST_APPROVED" &&
      status != "CANCELLED" &&
      status != "SHIPPED" &&
      status != "MULTI_STATUS"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "(MULTI_STATUS || SHIPPED || RETURN_REQUEST_APPROVED || DELIVERED || CANCELLED || RETURN_REQUEST || OUT_OF_DELIVERY || RETURNED) This Is Valied Status",
      });
    }
    array1 = req.Order.product;
    console.log(array1, "yuioi9");
    let value = "SINGLE";
    value = changeValueByKey(array1, "status", status, value);
    if (status == "RETURNED") {
      array1 = [];
    }
    console.log(array1);
    console.log(value);
    if (status == "RETURNED" && array1.length == 0) {
      for (let i = 0; i < req.Order.product.length; i++) {
        let a = await productModel.findById({
          _id: req.Order.product[i].productId,
        });
        await productModel.findByIdAndUpdate(
          { _id: req.Order.product[i].productId },
          {
            $set: {
              stock: a.stock - req.Order.product[i].quantity,
              sold: a.sold + req.Order.product[i].quantity,
            },
          },
          { new: true }
        );
      }
    }
    let statusUpdate = await orderModel.findOneAndUpdate(
      { _id: req.Order._id },
      { $set: { product: array1, status: value } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status Update Successfully...",
      data: statusUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= updateTransitionId ===================
exports.updateTransitionId = async (req, res) => {
  try {
    let array1 = req.Order.product;
    changeValueByKey(array1, "status", "ORDERED");
    const updtetrans = await orderModel.findOneAndUpdate(
      { _id: req.Order._id },
      {
        $set: {
          transactionId: req.body.transactionId,
          product: array1,
          status: "ORDERED",
        },
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "TransactionId Update Successfully",
      data: updtetrans,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================  getOrderByCustomerId ===================== ||
exports.getOrderByCustomerId = async (req, res) => {
  try {
    const orderget = await orderModel
      .find({ customerId: req.User._id })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Order Fatch Successfully...",
      data: orderget,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ============== getByOrderId ==================
exports.getByOrderId = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Order Fatch Successfully...",
      data: req.Order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ================= Cancle =================
exports.cancelOrder = async (req, res) => {
  try {
    let { reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "reason Is Required",
      });
    }
    let array1 = req.Order.product;
    changeValueByKey(array1, "status", "CANCELLED");
    let cancelData = await orderModel.findOneAndUpdate(
      { _id: req.Order._id },
      {
        $set: {
          status: "CANCELLED",
          reason: reason,
          cancleBy: "COSTOMER",
          product: array1,
        },
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully...",
      data: cancelData,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ================= return RequestOrder =================
exports.returnRequestOrder = async (req, res) => {
  try {
    await order.findOneAndUpdate(
      {
        _id: req.Order._id,
        "product.productId._id": req.query.productId,
      },
      { $set: { "product.$.status": req.body.status } },
      { new: true }
    );
    let cancelData = await orderModel.findOneAndUpdate(
      { _id: req.Order._id },
      { $set: { status: "MULTI_STATUS" } },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Status Update Successfully...",
      data: cancelData,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

function processArrayStatus(inputArray, Allstatus) {
  let status = "MULTI_STATUS";
  if (inputArray.length === 0) {
    return { array: [], status: status }; // Return an empty array for an empty input
  }

  // Get the status value from the first object in the array
  const commonStatus = inputArray[0].status;

  // Check if all objects have the same status value
  const allSameStatus = inputArray.every((obj) => obj.status === commonStatus);

  if (allSameStatus) {
    // Update the status value of all objects to "MULTI_STATUS"
    const newArray = inputArray.map((obj) => ({
      ...obj,
      status: Allstatus,
    }));
    return newArray;
  } else {
    return { array: inputArray, status: status }; // Return the same array if statuses are different
  }
}
