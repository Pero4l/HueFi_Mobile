const express = require('express');

require('dotenv').config();
// const cors = require("cors");


const app = express();
app.use(express.json());
// app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

const db = require("./config/db");

const userRoute = require('./routes/userRoute');
const walletRoute = require('./routes/walletRoute');

app.use('/auth', userRoute);
app.use('/wallet', walletRoute);



app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to HueFi",
  }); 
});



// DB CONNECTION
const PORT = process.env.PORT;

db.sync({ force: false, alter: true })
  .then(async () => {
    
    app.listen(PORT, () => {
      console.log(
        `Database connected successfully and Server running on PORT:${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`Database connection failed:`, e);
  });

  