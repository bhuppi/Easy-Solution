const express = require("express");
const http = require("http");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const taxModel = require("./src/models/taxModel");
const app = express();
require("dotenv").config();
const commpanyModel = require("./src/models/commpanyModel");
const homeProductModel = require("./src/models/homeProductModel");
const server = http.createServer(app);

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
});
app.use(express.json());
mongoose.set("strictQuery", true);

// Set up the database connection
mongoose
  .connect(
    "mongodb+srv://rudra:1234@cluster0.ynyguud.mongodb.net/HomeService",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    initial();
    initials();
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

// app.use("/uploads",express.static('uploads'))
app.use("/", express.static(__dirname + "/components"));

// Set up the route for the documents API
app.use("/api", require("./src/routes/categoryRoute"));
app.use("/api", require("./src/routes/cityRoute"));
app.use("/api", require("./src/routes/productRoute"));
app.use("/api", require("./src/routes/reviewRoute"));
app.use("/api", require("./src/routes/userRoute"));
app.use("/api", require("./src/routes/cartRoute"));
app.use("/api", require("./src/routes/membershipRoute"));
app.use("/api", require("./src/routes/couponRoute"));
app.use("/api", require("./src/routes/orderRoute"));
app.use("/api", require("./src/routes/patnerProfileRoute"));
app.use("/api", require("./src/routes/homeBannerRoute"));
app.use("/api", require("./src/routes/homeCategoryCartRoute"));
app.use("/api", require("./src/routes/appBannerRoute"));
app.use("/api", require("./src/routes/taxRoute"));
app.use("/api", require("./src/routes/privacyRoute"));
app.use("/api", require("./src/routes/contactUsRoute"));
app.use("/api", require("./src/routes/aboutUsRoute"));
app.use("/api", require("./src/routes/FAQRoute"));
app.use("/api", require("./src/routes/ecommerce/CartRoutes"));
app.use("/api", require("./src/routes/ecommerce/orderRoute"));
app.use("/api", require("./src/routes/ecommerce/CategoryRoutes"));
app.use("/api", require("./src/routes/ecommerce/ProductRoutes"));
app.use("/api", require("./src/routes/ecommerce/reviewRoute"));
app.use("/api", require("./src/routes/ecommerce/brandRoute"));
app.use("/api", require("./src/routes/commpanyRoute"));
app.use("/api", require("./src/routes/homePageRoute"));
app.use("/api", require("./src/routes/homeProductRoute"));
app.use("/api", require("./src/routes/ecommerce/homeCategoryCartRoute"));
app.use("/api", require("./src/routes/ecommerce/homeBannerRoute"));
app.use("/api", require("./src/routes/ecommerce/homePageRoute"));
app.use("/api", require("./src/routes/ecommerce/homeProductRoute"));
app.use("/api", require("./src/routes/ecommerce/addressRoute"));
app.use("/api",require("./src/routes/addressRoute"))
app.use("/", (res, req) => req.json("Path Is Not Found..."));

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function initial() {
  taxModel.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      console.log(count);
      taxModel.create({ taxPercent: 18 });
      taxModel.create({ taxPercent: 12 });
      taxModel.create({ taxPercent: 5 });
      taxModel.create({ taxPercent: 28 });
      taxModel.create({ taxPercent: 0 });
      console.log("Tax Created Successfully...");
    }
  });
}

function initials() {
  commpanyModel.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      console.log(count);
      commpanyModel.create({ site_name: "company name" });
      console.log("added 'Company' to Company collection");
    }
  });
}
