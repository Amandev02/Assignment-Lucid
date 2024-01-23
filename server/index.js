const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("./db/connection");
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');
const mongoose = require('mongoose');
const port = 8000;
const dnsRoutes = require('./routes/dnsRoutes');
// const dnsoracleRoutes = require('./routes/dnsoracleRoutes');
var cors = require('cors');
 app.use(cors());
// const router = express.Router();




app.use(bodyParser.json());
// app.use(router);

app.use(cookieParser());






// Route to handle incoming data from the frontend


//routes
app.use("/auth", authRoutes);
app.use("/api",dnsRoutes);
//app.use("/oracle", dnsoracleRoutes);


  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  
  app.get('*',(req,res,next)=>{
    res.status(200).json({
      message:'bad request'
    })
  })
