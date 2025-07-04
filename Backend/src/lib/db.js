import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected`);
  } catch(err) {
    console.error(`Error in MongoDB connect: ${err.message}`);
  }
};