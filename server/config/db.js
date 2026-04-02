import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using the MONGO_URI from environment variables.
 * Exits the process if the connection fails (fail-fast on startup).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
