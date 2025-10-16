const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async (options = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in environment');
    process.exit(1);
  }

  const maxRetries = options.retries ?? 5;
  const retryDelayMs = options.retryDelayMs ?? 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri, { connectTimeoutMS: 10000 });
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`);
      console.error(err && err.message ? err.message : err);

      // If last attempt, exit with code 1 so process manager can notice
      if (attempt === maxRetries) {
        console.error('All MongoDB connection attempts failed.');
        // Print a short diagnostic hint for Atlas users
        console.error('Hint: If you use MongoDB Atlas, ensure your current IP is allowed in the Network Access (IP whitelist) and your connection string is correct.');
        process.exit(1);
      }

      // Wait before retrying
      await new Promise((res) => setTimeout(res, retryDelayMs));
    }
  }
};

module.exports = connectDB;
