const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const addressModel = require("../models/addressModel");
const otpGenerator = require("otp-generator");
const userModel = require("../models/userModel");
const { userPermissions } = require("../helper/userPermission");
const userTypes = require("../helper/userType");
//const { invoice } = require("../midellwares/invoice");
function validateMobileNumber(number) {
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
}

// ===================== Otp Generator ====================== ||

const otp = () => {
  let o = Number(
    otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    })
  );
  return o;
};

// ========================== Get Id =================================== ||

exports.getOrderId = async (req, res, next, id) => {
  try {
    let Order = await orderModel
      .findById(id)
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
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

// ======================== Create Order ====================== ||

exports.createOrder = async (req, res) => {
  try {
    const {
      customerId,
      cityId,
      orderTotal,
      tax,
      couponeCode,
      couponeDiscount,
      addressId,
      date,
      time,
      totalOfferDiscount,
      netAmount,
      memberShipId,
      memberDiscount,
      memberDiscountPercent,
      paymentMethod,
      paymentStatus,
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
        message: "paymentMethod Is Required",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date Is Required",
      });
    }
    if (!time) {
      return res.status(400).json({
        success: false,
        message: "time Is Required",
      });
    }
    if (paymentMethod !== "COD" && paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "paymentMethod Only Use (COD && ONLINE)",
      });
    }

    let add = await addressModel.findById({_id:addressId})
    let completedOtp = otp();
    let workingOtp = otp();
    let arr = [];
    let Cart = await cartModel
      .find({ customerId: customerId })
      .populate("productId");
    if (!Cart.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Not Found" });
    }
    for (let i = 0; i < Cart.length; i++) {
      obj = {};
      obj.image = Cart[i].image;
      obj.productId = Cart[i].productId;
      obj.price = Cart[i].price;
      obj.quantity = Cart[i].quantity;
      arr.push(obj);
    }
    const Order = await orderModel.create({
      customerId: customerId,
      cityId: cityId,
      orderTotal: orderTotal,
      tax: tax,
      couponeCode: couponeCode,
      couponeDiscount: couponeDiscount,
      totalOfferDiscount: totalOfferDiscount,
      netAmount: netAmount,
      address: add,
      product: arr,
      memberShipId: memberShipId,
      memberDiscount: memberDiscount,
      memberDiscountPercent: memberDiscountPercent,
      workingOtp: workingOtp,
      completedOtp: completedOtp,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod == "COD" ? true : false,
      date: date,
      time: time,
      // invoice: IntersectionObserverEntry
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

// ======================== Update Status And Transtion Id ================================ ||

exports.updateTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction Id Is Required...",
      });
    }
    console.log(req.Order)
    //let a = invoice(req.Order);
    let updateOrder = await orderModel.findByIdAndUpdate(
      { _id: req.Order._id },
      {
        $set: {
          status: "ORDERED",
          transactionId: transactionId,
          paymentStatus: true,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Order Update Successfully...",
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Update Status And Transtion Id ================================ ||

exports.updateWorkingStatus = async (req, res) => {
  try {
    const { workingOtp } = req.body;
    if (!workingOtp) {
      return res.status(400).json({
        success: false,
        message: "WorkingOtp Id Is Required...",
      });
    }
    if (workingOtp !== req.Order.workingOtp) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Valide WorkingOtp",
      });
    }

    let updateOrder = await orderModel.findByIdAndUpdate(
      { _id: req.Order._id },
      {
        $set: {
          status: "WORKING",
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status Update Successfully...",
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Update Status And Transtion Id ================================ ||

exports.updateCompletedStatus = async (req, res) => {
  try {
    const { completedOtp } = req.body;
    if (!completedOtp) {
      return res.status(400).json({
        success: false,
        message: "completedOtp Id Is Required...",
      });
    }
    if (completedOtp !== req.Order.completedOtp) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Valide completedOtp",
      });
    }

    let updateOrder = await orderModel.findByIdAndUpdate(
      { _id: req.Order._id },
      {
        $set: {
          status: "COMPLETED",
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status Update Successfully...",
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ============================= Cancle Order ============================ ||

exports.cancelOrder = async (req, res) => {
  try {
    let { reason } = req.body;
    let cancleBy;
    if (req.Admin) {
      cancleBy = req.Admin.userType.includes("SUPER_ADMIN")
        ? "SUPER_ADMIN"
        : req.Admin.userType.includes("ADMIN")
        ? "ADMIN"
        : "SUB_ADMIN";
      reason = `Order Cancle By ${cancleBy}`;
    }
    if (req.User) {
      if (req.User._id == req.Order.customerId._id.toString()) {
        cancleBy = "COSTOMER";
      } else {
        cancleBy = "PATNER";
      }
    }
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "reason Is Required",
      });
    }
    let cancelData = await orderModel.findOneAndUpdate(
      { _id: req.Order._id },
      { $set: { status: "CANCELLED", reason: reason, cancleBy: cancleBy } },
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

// ======================= Get All Order By CostomerId ============================ ||

exports.getAllOrderByCostomerId = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let data = await orderModel
      .find({ customerId: req.User._id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
    let length = await orderModel.countDocuments({ customerId: req.User._id });
    let count = Math.ceil(length / 20);
    // if (!data.length) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Order Not Found",
    //     data: data,
    //   });
    // }
    return res.status(200).send({
      success: true,
      message: "All Customer Order Is Fatch...",
      data: data,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =========================== Get Order By Order Id =========================== ||

exports.getOrderByOrderId = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Order Fatch Successfully...",
      data: req.Order,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ============================ filter Order ======================== ||

exports.filterOrderByDate = async (req, res) => {
  try {
    const { status, filter, paymentMethod, name, orderId } = req.query;
    let obj = {};
    let obj2 = {};
    let turnOver = 0;
    let pendingCount = 0;
    let orderedCount = 0;
    let acceptedCount = 0;
    let onthewayCount = 0;
    let workingCount = 0;
    let completedCount = 0;
    let cancelCount = 0;
    if (req.filterQuery) {
      obj.createdAt = req.filterQuery;
    }
    if (status) {
      if (
        status != "PENDING" &&
        status != "ORDERED" &&
        status != "ACCEPTED" &&
        status != "ONTHEWAY" &&
        status != "WORKING" &&
        status != "COMPLETED" &&
        status != "CANCELLED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "'PENDING','ORDERED','ACCEPTED','ONTHEWAY','WORKING','COMPLETED', 'CANCELLED' are the valid status options.",
        });
      } else {
        obj.status = status;
      }
    }
    if (paymentMethod) {
      obj.paymentMethod = paymentMethod;
    }
    if (orderId) {
      obj._id = orderId;
    }
    if (req.query.price) {
      if (
        req.query.price != "low_to_high" &&
        req.query.price != "high_to_low"
      ) {
        return res.status(400).json({
          success: false,
          message: "'low_to_high', 'high_to_low' are the valid price options.",
        });
      } else {
        if ((req.query = "low-to-high")) {
          obj2.orderTotal = 1;
        } else if (req.query.price == "high-to-low") {
          obj2.orderTotal = -1;
        }
      }
    }
    obj2.createdAt = -1;
    let getData = await orderModel.find(obj).sort(obj2).populate({
      path: "customerId",
      select: "fullName",
    });
    function applyFilters(getData, name) {
      let filteredData = getData.filter((e) => {
        let isMatchingName =
          !name || new RegExp(name, "i").test(e.customerId?.fullName);

        if (isMatchingName) {
          if (e.status === "PENDING") {
            pendingCount++;
          } else if (e.status === "ORDERED") {
            orderedCount++;
          } else if (e.status === "ACCEPTED") {
            acceptedCount++;
          } else if (e.status === "ONTHEWAY") {
            onthewayCount++;
          } else if (e.status === "WORKING") {
            workingCount++;
          } else if (e.status === "COMPLETED") {
            completedCount++;
          } else if (e.status === "CANCELLED") {
            cancelCount++;
          }

          if (e.orderTotal) {
            turnOver += e.orderTotal;
          }

          return true;
        }

        return false;
      });
      return {
        filteredData,
        pendingCount,
        orderedCount,
        acceptedCount,
        onthewayCount,
        workingCount,
        completedCount,
        cancelCount,
        turnOver,
      };
    }
    const result = applyFilters(getData, name);
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = result.filteredData.length;
    let count = Math.ceil(length / 20);
    let data = result.filteredData.slice(startIndex, endIndex);
    return res.status(200).json({
      success: true,
      message: "Order Is Filter Successfully...",
      data: data,
      turnOver: turnOver,
      pendingCount: pendingCount,
      orderedCount: orderedCount,
      acceptedCount: acceptedCount,
      onthewayCount: onthewayCount,
      workingCount: workingCount,
      completedCount: completedCount,
      cancelCount: cancelCount,
      page: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================== getAllDataByPartnerId ====================

exports.getOrderByPartnerId = async (req, res) => {
  try {
    let dataByPartnerId = await orderModel
      .find({
        partnerId: req.User._id,
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
    if (!dataByPartnerId.length) {
      return res.status(400).json({
        success: false,
        message: "Order Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Data fetched By PartnerId successfully",
      data: dataByPartnerId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =========================== onTheWayStatusUpdate ===============================

exports.onTheWayStatusUpdate = async (req, res) => {
  try {
    let dataByPartnerId = await orderModel
      .findOneAndUpdate(
        {
          _id: req.Order._id,
          partnerId: req.User._id,
        },
        { $set: { status: "ONTHEWAY" } },
        { new: true }
      )
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
    if (!dataByPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully...",
      data: dataByPartnerId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =========================== acceptedStatusUpdate ===============================

exports.acceptedStatusUpdate = async (req, res) => {
  try {
    let dataByPartnerId = await orderModel
      .findOneAndUpdate(
        {
          _id: req.Order._id,
        },
        { $set: { status: "ACCEPTED", partnerId: req.User._id } },
        { new: true }
      )
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully...",
      data: dataByPartnerId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Create Order By Admin ====================== ||

exports.createOrderByAdmin = async (req, res) => {
  try {
    let userdata;
    const {
      fullName,
      phoneNumber,
      disable,
      userType,
      permissions,
      customerId,
      cityId,
      orderTotal,
      tax,
      couponeCode,
      couponeDiscount,
      googleGenerateAddress,
      houseNumber,
      area,
      landmark,
      totalOfferDiscount,
      netAmount,
      memberShipId,
      memberDiscount,
      memberDiscountPercent,
      categoryId,
    } = req.body;
    if (!customerId && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Customer Is Required...",
      });
    }
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: "cityId Is Required...",
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
    if (!googleGenerateAddress) {
      return res.status(400).json({
        success: false,
        message: "googleGenerateAddress Is Required...",
      });
    }
    if (!houseNumber) {
      return res.status(400).json({
        success: false,
        message: "houseNumber Is Required...",
      });
    }
    if (!area) {
      return res.status(400).json({
        success: false,
        message: "area Is Required...",
      });
    }
    if (!landmark) {
      return res.status(400).json({
        success: false,
        message: "landmark Is Required...",
      });
    }
    if (!netAmount) {
      return res.status(400).json({
        success: false,
        message: "netAmount Is Required...",
      });
    }
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId Is Required...",
      });
    }
    const check = await userModel.findOne({ phoneNumber: phoneNumber });
    if (!check && phoneNumber) {
      if (!fullName) {
        return res
          .status(400)
          .send({ success: false, message: "Enter Your Full Name" });
      }
      if (!phoneNumber) {
        return res
          .status(400)
          .send({ success: false, message: "Enter Your Phone Number" });
      }
      if (!validateMobileNumber(phoneNumber)) {
        return res.status(400).send({
          success: false,
          message: "please provide valid 10 digit number",
        });
      }
      console.log(Object.values(userTypes.userType).includes(userType));
      if (userType && !Object.values(userTypes.userType).includes(userType)) {
        return res.status(400).json({
          success: false,
          message:
            "Only This Type Of UserType (ADMIN && SUB_ADMIN && CUSTOMER && PARTNER)",
        });
      }
      if (
        permissions &&
        !Object.values(userPermissions).includes(permissions)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only This Type Of UserType (ALL && CATERGORY && ORDER && PRODUCT && CITY)",
        });
      }
      userdata = await userModel.create({
        fullName: fullName,
        phoneNumber: phoneNumber,
        userType: userType,
        permissions: permissions,
        disable: disable,
      });
    }
    let address = {};
    address.googleGenerateAddress = googleGenerateAddress;
    address.houseNumber = houseNumber;
    address.area = area;
    address.landmark = landmark;
    let completedOtp = otp();
    let workingOtp = otp();
    let arr = [];
    let Cart = await cartModel
      .find({ customerId: req.Admin._id })
      .populate("productId");
    if (!Cart.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Is Not Found In DB..." });
    }
    for (let i = 0; i < Cart.length; i++) {
      obj = {};
      obj.image = Cart[i].image;
      obj.productId = Cart[i].productId;
      obj.price = Cart[i].price;
      obj.quantity = Cart[i].quantity;
      arr.push(obj);
    }
    const Order = await orderModel.create({
      customerId: customerId
        ? customerId
        : check != null
        ? check._id
        : userdata._id,
      cityId: cityId,
      orderTotal: orderTotal,
      tax: tax,
      couponeCode: couponeCode,
      couponeDiscount: couponeDiscount,
      totalOfferDiscount: totalOfferDiscount,
      netAmount: netAmount,
      address: address,
      product: arr,
      memberShipId: memberShipId,
      memberDiscount: memberDiscount,
      memberDiscountPercent: memberDiscountPercent,
      workingOtp: workingOtp,
      completedOtp: completedOtp,
      categoryId: categoryId,
    });
    return res.status(200).json({
      success: true,
      message: "Order Is Created Successfully By Admin..",
      data: Order,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =========================== acceptedStatusUpdate ===============================

exports.AssignePartnerByAdmin = async (req, res) => {
  try {
    let dataByPartnerId = await orderModel
      .findOneAndUpdate(
        {
          _id: req.Order._id,
        },
        { $set: { status: "ACCEPTED", partnerId: req.User._id } },
        { new: true }
      )
      .populate({
        path: "customerId partnerId cityId memberShipId",
      })
      .populate({
        path: "product.productId",
      });
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully...",
      data: dataByPartnerId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
