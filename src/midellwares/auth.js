const userModel = require("../models/userModel");
const { userType } = require("../helper/userType");
const jwt = require("jsonwebtoken");
function validateMobileNumber(number) {
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
}
// =========================== Admin Route Cheack ======================= ||

exports.adminRoute = async (req, res, next, id) => {
  try {
    let User = await userModel.findById(id);
    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User Is Found In Date Base...",
      });
    } else {
      let token = req.headers["authorization"];
      if (!token)
        return res.status(404).send({
          success: false,
          message: "jwt token must be required",
          isAuthorized: false,
        });
      let decodeToken = jwt.verify(token, "SECRETEKEY");
      if (!decodeToken)
        return res.status(400).send({
          success: true,
          message: "token is not valid",
          isAuthorized: false,
        });
      if (
        (User._id.toString() === decodeToken.User &&
          User.userType.includes(userType.admin)) ||
        User.userType.includes(userType.subAdmin) ||
        User.userType.includes(userType.superAdmin)
      ) {
        (req.Admin = User), next();
      } else {
        return res.status(400).json({
          success: false,
          message: "You Are Not Admin...",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};