require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/b2b", require("./routes/b2bRoutes"));
app.use("/api/jobcards", require("./routes/jobCardRoutes"));
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/payroll", require("./routes/payrollRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("Photo Studio Management API Running");
});

io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});