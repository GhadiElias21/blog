import e from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err)=>{
    console.log(err);
  })

const app = e();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
