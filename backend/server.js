const express = require("express");
const cors = require("cors");
const app = express();

require("./db");

app.use(cors({
  origin: ["https://supportmovex-prog.github.io", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/booking"));

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server Running");
});
