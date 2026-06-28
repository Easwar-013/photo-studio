const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    console.log("Database Name:", conn.connection.name);
    console.log("Host:", conn.connection.host);
    console.log("Port:", conn.connection.port);

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;