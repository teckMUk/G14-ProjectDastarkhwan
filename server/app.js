import express from "express";
import bodyParser from 'body-parser';
import admin from "./routes/adminRoutes";
import midErr from "./middleware/basicErr";
import ngo from "./routes/ngoRoutes";
import rest from "./routes/restRoutes";
import user from "./routes/userRoutes";
import auth from "./routes/authRoutes"
import cookieParser from "cookie-parser";
import cors from 'cors'

//import multer from 'multer';
// var form = multer()

import { rejectApplication } from "./backgroundTask/autoRejectJob";
const app = express();

// // Init an Express App. 
// // Use your dependencies here
// // use all controllers(APIs) here
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(form.array());
// app.use(express.static('public'))
app.use(cookieParser());
app.use(cors());

//admin

app.use("/api/v1/admin", admin);
app.use("/api/v1/ngo", ngo);
app.use("/api/v1/user", user);
app.use("/api/v1/rest", rest);
app.use("/api/v1/auth", auth);
///middleware err this must always be at the end 
app.use(midErr);

//background task called
//rejectApplication();

export default app;