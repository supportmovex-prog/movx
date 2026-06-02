const express = require("express");

const cors = require("cors");

const app = express();

require("./db");

app.use(cors());

app.use(express.json());


// ROUTES
app.use("/api", require("./routes/auth"));

app.use("/api", require("./routes/booking"));



app.listen(5000, ()=>{

    console.log("🚀 Server Running");

});