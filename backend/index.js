const express = require('express');
const cors = require("cors");

require('dotenv').config();



const app = express();

// Comprehensive CORS configuration
app.use(cors({ 
  origin: "*", // During production, change this to your game's domain e.g., ["https://mygame.com"]
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./config/db");

const userRoute = require('./routes/userRoute');
const walletRoute = require('./routes/walletRoute');
const settingRoute = require('./routes/settingRoute');
const leaderboardRoute = require('./routes/leaderboardRoute');

app.use('/auth', userRoute);
app.use('/wallet', walletRoute);
app.use('/setting', settingRoute);
app.use('/', leaderboardRoute);



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

  