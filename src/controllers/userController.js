const userModel = require("../models/userModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const http = require("http");
const membershipModel = require("../models/memberShipModel");
const { userPermissions } = require("../helper/userPermission");
const userTypes = require("../helper/userType");
const bcrypt = require("bcrypt");

// ======================== Mobile Number Validete ========================== ||

function validateMobileNumber(number) {
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
}

// =========================== Send Otp Function ============================== ||

const sendOtpFunction = (mobile, otp) => {
  const options = {
    method: "POST",
    hostname: "api.msg91.com",
    port: null,
    path: "/api/v5/flow/",
    headers: {
      authkey: "384292AwWekgBJSf635f77feP1",
      "content-type": "application/json",
    },
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(
    `{\n  \"flow_id\": \"63614b3dabf10640e61fa856\",\n  \"sender\": \"Home Service\",\n  \"mobiles\": \"91${mobile}\",\n  \"otp\": \"${otp}\"\n}`
  );
  req.end();
};

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

// =================== Register ====================== ||

exports.register = async (req, res) => {
  try {
    const { fullName, phoneNumber, disable, userType, permissions, hashKey } =
      req.body;
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
    const check = await userModel.findOne({ phoneNumber: phoneNumber });
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile Number Is Already Exsist.." });
    }
    if (userType && !Object.values(userTypes.userType).includes(userType)) {
      return res.status(400).json({
        success: false,
        message:
          "Only This Type Of UserType (ADMIN && SUB_ADMIN && CUSTOMER && PARTNER)",
      });
    }
    if (!hashKey) {
      return res.status(400).send({
        success: false,
        message: "hashKey Is Required....",
      });
    }
    if (process.env.hash_Key.toString() !== hashKey) {
      return res
        .status(400)
        .send({ success: false, message: "hashKey is not valid" });
    }
    let userdata = await userModel.create({
      // image: req.file ? req.file.key : null,
      fullName: fullName,
      phoneNumber: phoneNumber,
      userType: userType,
      permissions: permissions,
      disable: disable,
    });
    const generate = await jwt.sign({ User: userdata._id }, "SECRETEKEY", {
      expiresIn: "7d",
    });
    userdata._doc.token = generate;
    return res.status(201).send({
      success: true,
      message: "Register Successfully",
      data: userdata,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== log In ========================= ||

exports.login = async (req, res) => {
  try {
    if (req.user.disable == true) {
      return res.status(400).json({
        success: false,
        message: "User Is Ban..",
      });
    }
    const generate = await jwt.sign({ User: req.user._id }, "SECRETEKEY", {
      expiresIn: "7d",
    });
    req.user._doc.token = generate;
    return res.status(200).send({
      success: true,
      message: "User Successfully Login...",
      data: req.user,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ================== Get By Id ======================== ||

exports.getUserById = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "User Is Fetched Successfully...",
      data: req.User,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Get All User ======================== ||

exports.getAllUser = async (req, res) => {
  try {
    const { search, disable, page, userType } = req.query;
    let a = null;
    if (search && !isNaN(Number(search))) {
      a = Number(search);
    }
    let query = {
      userType: { $nin: ["SUPER_ADMIN"] },
      phoneNumber: { $nin: [null, undefined] },
    };

    if (a !== null && a !== undefined) {
      query.phoneNumber = a;
    }
    
    if (
      userType &&
      Object.values(userTypes.userType).includes(userType)
    ) {
      query.userType = [userType];
    }
    if(disable){
      query.disable = disable
    }
    console.log(query)
    let getData = await userModel.find(query).sort({ createdAt: -1 });
    console.log(getData)
    if (
      search &&
      a == null &&
      a == undefined &&
      !Object.values(userTypes.userType).includes(search.toUpperCase())
    ) {
      console.log("dhjkduddudu")
      const regexSearch = new RegExp(search, "i");
      getData = getData.filter((e) => {
        return regexSearch.test(e?.fullName);
      });
    }
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = getData.length;
    let count = Math.ceil(length / 20);
    let data = getData.slice(startIndex, endIndex);
    return res.status(200).send({
      success: true,
      message: "All User Fatch Successfully...",
      data: data,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ========================= Send Otp =========================== ||

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber, check } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Is Required...",
      });
    }
    if (!validateMobileNumber(phoneNumber)) {
      return res.status(400).send({
        success: false,
        message: "please provide valid 10 digit number",
      });
    }
    let Otp = otp();
    if (check == true) {
      let getData = await userModel.findOne({ phoneNumber: phoneNumber });
      if (!getData) {
        return res.status(404).send({
          success: false,
          message: "User Not Found",
        });
      } else {
        sendOtpFunction(phoneNumber, Otp);
      }
    } else {
      sendOtpFunction(phoneNumber, Otp);
    }
    return res.status(200).json({
      success: true,
      message: "Otp Send Successfully...",
      otp: Otp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== Log Out ===================== ||

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("authorization");
    res
      .status(200)
      .json({ success: true, message: "Successfully Logout Your Account" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================= Update User ========================== ||

exports.updateUser = async (req, res) => {
  try {
    function calculateNewDate(originalDate, numMonths) {
      const [year, month, day] = originalDate.split("-");
      console.log(month - 1);
      const originalDateObj = new Date(year, month - 1, day);
      console.log(originalDateObj);
      const newDateObj = new Date(originalDateObj);
      newDateObj.setMonth(newDateObj.getMonth() + numMonths);
      while (newDateObj.getDate() !== originalDateObj.getDate()) {
        newDateObj.setDate(newDateObj.getDate() - 1);
      }
      const newDateStr = newDateObj.toISOString();
      return newDateStr;
    }
    const { fullName, phoneNumber, membershipId, permissions } = req.body;
    if (permissions) {
      if (
        permissions !== "ALL" &&
        permissions !== "ORDER" &&
        permissions !== "CATERGORY" &&
        permissions !== "PRODUCT" &&
        permissions !== "CITY"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only This Type Of UserType (ALL && CATERGORY && ORDER && PRODUCT && CITY)",
        });
      }
    }
    if (req.User.permissions && permissions) {
      if (req.User.permissions.includes("NONE")) {
        req.User.permissions.splice(0, 1);
      }
      if (!req.User.permissions.includes(permissions)) {
        req.User.permissions.push(permissions);
      }
    }
    let obj = {};
    if (membershipId) {
      let startDate = new Date();
      let memberShip = await membershipModel.findById(membershipId);
      const startDateStr = startDate.toISOString().slice(0, 10);
      const newDate = calculateNewDate(
        startDateStr,
        memberShip.durationInMonth
      );
      obj.membershipId = membershipId;
      obj.logo = memberShip.logo;
      obj.features = memberShip.features;
      obj.durationInMonth = memberShip.durationInMonth;
      obj.discountPercent = memberShip.discountPercent;
      obj.startDate = startDateStr;
      obj.endDate = newDate;
      obj.title = memberShip.title;
    }
    if (phoneNumber) {
    }
    const UpdateUser = await userModel.findByIdAndUpdate(
      { _id: req.User._id },
      {
        $set: {
          image: req.file ? req.file.key : req.User.image,
          fullName: fullName,
          phoneNumber: phoneNumber,
          permissions: req.User.permissions,
          membership: membershipId ? obj : req.User.membership,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User Is Update Successfully...",
      data: UpdateUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================= Disable User ===================== ||

exports.disableUser = async (req, res) => {
  try {
    let updateUser = await userModel.findByIdAndUpdate(
      { _id: req.User._id },
      {
        $set: {
          disable: !req.User.disable,
        },
      },
      { new: true }
    );
    if (updateUser.disable == true) {
      return res.status(200).json({
        success: true,
        message: "User Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== Get User By PhoneNumber ==================== ||

exports.getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    let obj = {};
    obj.phoneNumber = phoneNumber;
    let User = await userModel.findOne(obj);
    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Fatch Successfully",
      data: User,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { phoneNumber, email, password } = req.body;
    if (phoneNumber && email) {
      return res.status(400).json({
        success: false,
        message: "Only One Is Required (PhoneNumbe && Email)",
      });
    }
    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: "Only One Is Required (PhoneNumbe && Email)",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password Is Required...",
      });
    }
    let obj = {};
    if (phoneNumber) {
      obj.phoneNumber = phoneNumber;
    }
    if (email) {
      obj.email = email;
    }
    let user = await userModel.findOne(obj);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Admin Not Found",
      });
    }
    let result = await bcrypt.compareSync(password, user.password);
    if (!result) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Valid Password..",
      });
    }
    const generate = await jwt.sign({ User: user._id }, "SECRETEKEY", {
      expiresIn: "7d",
    });
    // const generate = await jwt.sign({ User: user._id }, "SECRETEKEY");
    user._doc.token = generate;
    return res.status(200).send({
      success: true,
      message: "Admin Successfully Login...",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.craeteAdminAndSubAdmin = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      disable,
      userType,
      permissions,
      email,
      password,
    } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password Is Required...",
      });
    }
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Is Required...",
      });
    }
    if (phoneNumber) {
      if (!validateMobileNumber(phoneNumber)) {
        return res.status(400).send({
          success: false,
          message: "please provide valid 10 digit number",
        });
      }
    }
    let obj = {};
    if (phoneNumber) {
      obj.phoneNumber = phoneNumber;
    }
    if (email) {
      obj.email = email;
    }
    const check = await userModel.findOne(obj);
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: "User Is Already Exsist.." });
    }
    // console.log()
    if (userType && !Object.values(userTypes.userType).includes(userType)) {
      return res.status(400).json({
        success: false,
        message:
          "Only This Type Of UserType (ADMIN && SUB_ADMIN && CUSTOMER && PARTNER)",
      });
    }
    let hash = bcrypt.hashSync(req.body.password, 8);
    let userdata = await userModel.create({
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      password: hash,
      userType: userType ? userType : "SUB_ADMIN",
      permissions: permissions,
      disable: disable,
    });
    return res.status(201).send({
      success: true,
      message: "Admin Create Successfully",
      data: userdata,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getUserBYToken = async (req, res) => {
  try {
    let token = req.headers["authorization"];
    let decodeToken = jwt.verify(token, "SECRETEKEY");
    if (!decodeToken) {
      return res
        .status(400)
        .send({ success: false, message: "token is not decoded" });
    }
    // console.log(decodeToken)
    let getUser = await userModel.findById({ _id: decodeToken.User });
    if (!getUser) {
      return res
        .status(400)
        .send({ success: false, message: "you are not a valid user" });
    }

    return res.status(200).send({
      success: true,
      message: "user fetched successfully",
      data: getUser,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
