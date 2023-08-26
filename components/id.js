const companyModel = require('../src/models/commpanyModel')

const partnerIdCard=async(data)=>{
    let company = await companyModel.find()
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Id Card</title>
    <style>
      html {
        font-size: 62.5%;
      }

      /* .container {
            border: 1px solid rgb(31, 31, 31);
            border-radius: .7rem;
            margin: 1%;
            padding: 1%;
            /* width: 65%; 
        
        } */

      .container {
        margin: 20px;
        justify-content: center;
        display: flex;
        /* border: 1px solid black; */
      }

      .Card {
        width: 30%;
        padding: 1% 0;
        justify-content: center;
        align-items: center;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border: 1px solid rgb(224, 223, 223);
        border-radius: 7px;
      }

      .logo {
        
        padding: 1%;
        height: 6rem;
        width: 18%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .img {
        width: 41%;
        height: 25vh;
      }

      /* th,
        td {
            text-align: left;
            padding: 4px;
            border: 1px solid black;
            color: black;
            font-size: 1.5rem;


        }

        th {
            background-color: rgb(234, 234, 246);
        }

        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            height: 2rem;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        } */

      @media (max-width: 900px) {
        html {
          font-size: 50%;
        }

        .Card {
          width: 80%;
        }

        /* 
            .table {
                font-size: 40.5% !important;
            } */
        .container {
          padding: 0%;
        }

        .logo {
          /* height: 3vh; */
          width: 15%;
        }

        .img {
          width: 41%;
          height: 16vh;
        }
      }

      @media (max-width: 1050px) {
        html {
          font-size: 64%;
        }

        .Card {
          width: 75%;
        }

        /* 
            .table {
                font-size: 40.5% !important;
            } */
        .container {
          padding: 0%;
        }

        .logo {
          /* height: 8%; */
          width: 15%;
        }

        .img {
          width: 33%;
          height: 17vh;
        }
      }

      @media (max-width: 480px) {
        html {
          font-size: 38%;
        }

        /* .table {
                font-size: 30.5% !important;
            } */
        th,
        td {
          font-size: 1.4rem;
        }

        .logo {
          /* height: 5vh; */
          width: 15%;
        }

        .Card {
          width: 100%;
        }

        .img {
          width: 40%;
          height: 20vh;
        }
      }

      @media (max-width: 360px) {
        html {
          font-size: 25%;
        }

        .table {
          font-size: 40.5% !important;
        }

        .logo {
          height: 3vh;
          width: 15%;
        }

        .img {
          width: 40%;
          height: 14vh;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="Card">
        <div
          style="
            display: flex;
            justify-content: center;
            gap: 3%;
            flex-direction: column;
            align-items: center;
          "
        >
          <div class="logo">
            <img src="essaylogo.png" style="height: 100%; width: 100%;border-radius: 7px;" />
          </div>
          <div>
            <h1 style="color: brown; font-size: 1.8rem; font-style: normal">
              ${company.site_name}
            </h1>
            <p
              style="
                color: rgb(38, 15, 95);
                font-size: 1.2rem;
                font-style: normal;
                font-weight: 600;
                align-items: center;
                display: flex;
                justify-content: center;
              "
            >
              SERVICES
            </p>
          </div>
        </div>

        <div
          style="
            background-color: rgb(223, 101, 101);
            width: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
            display: flex;
          "
        >
          <h1 style="color: white; font-size: 1.8rem; font-style: normal">
            ID CARD
          </h1>
        </div>

        <div
          style="
            width: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
            display: flex;
            padding: 2%;
          "
        >
          <div class="img">
            <img
              src="${data.selfie.image}"
              style="height: 100%; width: 100%; border-radius: 50%"
            />
          </div>
        </div>
        <div
          style="
            padding: 1px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          "
        >
          <h2 style="color: black; font-size: 1.8rem; font-style: normal">
            ${data.name}
          </h2>
        </div>

        <div style="padding: 0px 20%; display: flex; flex-direction: column; margin-bottom: 3%;">
          <div style="display: flex; justify-content: space-between">
            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
              "
            >
            Partner Id :
            </h6>

            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
                font-weight: 500;
              "
            >
           ${data._id}
            </h6>
          </div>
          <div style="display: flex; justify-content: space-between">
            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
              "
            >
              Email :
            </h6>

            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
                font-weight: 500;
              "
            >
              ${data.email}
            </h6>
          </div>
          <div style="display: flex; justify-content: space-between">
            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
              "
            >
              Phone Number :
            </h6>

            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
                font-weight: 500;
              "
            >
              ${data.phoneNumber}
            </h6>
          </div>
          <div style="display: flex; justify-content: space-between">
            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
              "
            >
              Address :
            </h6>

            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
                font-weight: 500;
              "
            >
              ${data.address}
            </h6>
          </div>
          <div style="display: flex; justify-content: space-between">
            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
              "
            >
              Pincode :
            </h6>

            <h6
              style="
                color: black;
                font-size: 1.5rem;
                font-style: normal;
                margin: 6px;
                font-weight: 500;
              "
            >
              ${data.pincode}
            </h6>
          </div>
        </div>

        <hr />
        <div
          style="
            width: 100%;
            display: flex;
            padding: 2%;
            height: 1rem;
            align-items: center;
            margin-top: 3%;
          "
        >
          <h6
            style="
              color: black;
              font-size: 1.5rem;
              font-style: normal;
              margin: 6px;
            "
          >
            Contect Us:
          </h6>
          <h6
            style="
              color: black;
              font-size: 1.5rem;
              font-style: normal;
              margin: 6px;
              font-weight: 500;
            "
          >
            ${company.phone}
          </h6>
        </div>
        <div
          style="
            width: 100%;
            display: flex;
            padding: 2%;
            height: 1rem;
            align-items: center;
          "
        >
          <h6
            style="
              color: black;
              font-size: 1.5rem;
              font-style: normal;
              margin: 6px;
            "
          >
            Address:
          </h6>
          <p style="color: black; font-size: 1.5rem; font-style: normal">
           ${company.address}
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`
}