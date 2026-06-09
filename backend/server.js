require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

require("./db");

app.use(cors({
  origin: [
    "https://www.movex.services",
    "https://movex.services",
    "https://supportmovex-prog.github.io",
    "http://localhost:5500",
    "http://localhost:5000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/booking"));
app.use("/api", require("./routes/payment"));

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("🚀 Server Running");
});