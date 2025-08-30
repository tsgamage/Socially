import mongoose from "mongoose";

export const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;
  // Cheking Whether DB is already connected
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (connectionState === 1) {
    console.log(`MongoDB already connected: ${mongoose.connection.host}`);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
