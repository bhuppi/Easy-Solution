const cityModel = require("../models/cityModel");

// ========================== Get Id =================================== ||

exports.getCityId = async (req, res, next, id) => {
  try {
    let City = await cityModel.findById(id);
    if (!City) {
      return res.status(404).json({
        success: false,
        message: "City Not Found",
      });
    } else {
      (req.City = City), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Create City ================================== ||

exports.createCity = async (req, res) => {
  try {
    let { cityName, cityId } = req.body;
    if (!cityName) {
      return res.status(400).json({
        success: false,
        message: "CityName Is Required...",
      });
    }
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: "CityId Is Required...",
      });
    }
    let City = await cityModel.create({
      cityName: cityName,
      cityId: cityId,
    });
    return res.status(201).json({
      success: true,
      message: "City Is Created Successfully...",
      data: City,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== Get By Id =================================== ||

exports.getByCityId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "City Fatch Successfully...",
      data: req.City,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllCity = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await cityModel.countDocuments({ disable: false });
    let count = Math.ceil(length / 20);
    let City = await cityModel
      .find({ disable: false })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!City.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "City Not Found",
    //   });
    // } else {
      return res.status(200).json({
        success: true,
        message: "All City Fatch Successfully...",
        data: City,
        page: count,
      });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== Update City ============================ ||

exports.updateCity = async (req, res) => {
  try {
    let City = req.City;
    let { cityName, cityId } = req.body;
    let updateCity = await cityModel.findByIdAndUpdate(
      { _id: City._id },
      {
        $set: {
          cityName: cityName,
          cityId: cityId,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "City Update Successfully...",
      data: updateCity,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================== Delete City ========================= ||

exports.deleteCity = async (req, res) => {
  try {
    let deleteCity = await cityModel.deleteOne({
      _id: req.City._id,
    });
    return res.status(200).json({
      success: true,
      message: "City Delete Successfully...",
      data: deleteCity,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================ Disable City ======================== ||

exports.disableCity = async (req, res) => {
  try {
    let updateCity = await cityModel.findByIdAndUpdate(
      { _id: req.City._id },
      {
        $set: {
          disable: !req.City.disable,
        },
      },
      { new: true }
    );
    if (updateCity.disable == true) {
      return res.status(200).json({
        success: true,
        message: "City Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "City Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================== Get All ============================ ||

exports.getAllCityByAdmin = async (req, res) => {
  try {
    let page = req.query.page;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await cityModel.countDocuments();
    let count = Math.ceil(length / 20);
    let City = await cityModel
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    // if (!City.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "City Not Found",
    //   });
    // } else {
      return res.status(200).json({
        success: true,
        message: "All City Fatch Successfully...",
        data: City,
        page: count,
      });
    // }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
