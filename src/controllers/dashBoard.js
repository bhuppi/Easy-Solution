const { userType } = require("../helper/userType");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

// ================== dashBoard ================== ||

exports.dashBoard = async (req, res) => {
  try {
    let getAllOrder = await orderModel.find();
    let getAllUser = await userModel.find();
    const userData = Object.values(userType).reduce(
      (acc, type) => ({
        ...acc,
        [type]: getAllUser.filter((user) => user.userType.includes(type))
          .length,
      }),
      {}
    );
    const count = {
      ORDER: getAllOrder.length,
      USER: getAllUser.length,
      TURNOVER: 0,
    };
    getAllOrder.map((o) => {
      if (o.orderTotal) {
        count.TURNOVER += o.orderTotal;
      }
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 7);
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    // let currentDate = currentDate.getMonth();
    // let currentYear = currentDate.getFullYear();
    const orders = await orderModel.find({
      createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
    });

    const orderCountsByMonth = {};
    for (let i = 0; i < 6; i++) {
      const monthYear = `${currentMonth + 1}-${currentYear}`;
      orderCountsByMonth[monthYear] = 0;
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
    }

    orders.forEach((order) => {
      const monthYear = `${
        order.createdAt.getMonth() + 1
      }-${order.createdAt.getFullYear()}`;

      if (!orderCountsByMonth[monthYear]) {
        orderCountsByMonth[monthYear] = 0;
      }
      orderCountsByMonth[monthYear]++;
    });

    let orderCount = {};
    for (const monthYear in orderCountsByMonth) {
      const month = parseInt(monthYear.split("-")[0]);
      const year = parseInt(monthYear.split("-")[1]);

      const monthName = new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
      });
      if (!orderCount[monthName]) {
        orderCount[monthName] = 0;
      }
      orderCount[monthName] += orderCountsByMonth[monthYear];
    }

    //  ============== WeekDay
    const orderCountsByDayOfWeek = [0, 0, 0, 0, 0, 0, 0]; // Sunday, Monday, Tuesday, ..., Saturday
    
    orders.forEach((order) => {
      const orderDate = order.createdAt;
      const dayOfWeek = orderDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    
      orderCountsByDayOfWeek[dayOfWeek]++;
    });
    
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const orderCountByDayOfWeek = {};
    
    weekdays.forEach((weekday, index) => {
      orderCountByDayOfWeek[weekday] = orderCountsByDayOfWeek[index];
    });
    
    return res.status(200).send({
      success: true,
      message: "fetching your data successfully",
      data: {
        count,
        orderCountsByMonth: orderCount,
        orderCountByWeekday: orderCountByDayOfWeek,
        userData: userData,
      },
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
