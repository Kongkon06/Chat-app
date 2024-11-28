import express from "express";
import  postRoute  from './Post/post';
import  userRoute  from './User/User'
import cors from "cors"
const App = express();

App.use(express.json());
App.use(cors());
App.use('/api/v1/user',userRoute);
App.use('/api/v1/post',postRoute);

App.listen(3000,()=>{
  console.log("Server is running");
});



