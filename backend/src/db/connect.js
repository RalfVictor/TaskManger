import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("Attempt to connect to Database..");
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to Database..");
  } catch (error) {
    console.log("Failed to Connect to Database...", error.message);
    process.exit(1);
  }
};

export default connect;
