const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });

    console.log(" MongoDB Connected Successfully");
    console.log(` Database: ${conn.connection.name}`);
    console.log(` Cluster Host: ${conn.connection.host}`);

  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;