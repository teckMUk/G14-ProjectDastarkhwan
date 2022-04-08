import User from "../models/userSchema.mjs";
import Donation from "../models/donationsSchema.mjs";
import Ngo from "../models/ngoSchema.mjs"
import { handleAsyncErr } from "../middleware/handleAsyncErr.js";
import bcrypt from "bcrypt";
import HandErr from "../utils/err.js";
import {tokenMaker} from "../utils/tokenManager"
import mongoose from "mongoose";

//login 
export const userLogin =  handleAsyncErr(async (req,res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
       
        return next(new HandErr("email or password missing", 400))
    }
    const user = await User.findOne({email}); 
    let pw = user.password;

    if(!user){
       
        return next(new HandErr("Wrong email or password", 401));
    }
    if(!user.isActive){
        return next(new HandErr("User not exist", 401));
    }
    let boolCheck  = await bcrypt.compare(password, pw);
    //boolCheck = user.password == password ? true : false; //add bcrypt here

    if(boolCheck){
        tokenMaker(user, 201, res);
        // res.status(200).json({
        //     success: true,
        //     message: "user logged in",
        //     user
        //   });
    }
    else
    {
        return next(new HandErr("Password entered wrong", 401));
    }

});

export const userRegister = handleAsyncErr(async (req, res, next) =>{
    const {name, email, phoneNumber, password,description,userName,address, CNIC} = req.body;
    console.log(req.body);
   
    if(!name || !email || !phoneNumber || !password || !description ||!CNIC || !userName || !address){
        return next(new HandErr("some fields are missing enter again!", 400))
    }
    let appUser = await User.find({email});
   
    if(appUser.length > 0){
        return next(new HandErr("user already exists", 401));
    }
    let pw = await bcrypt.hash(password, 12);
    //console.log(address);
    
    const userApp = await User.create({
        name: name, 
        email: email, 
        phoneNumber: phoneNumber, 
        password: pw , 
        address: address,
        description: description, 
        userName : userName,
        isActive: true,
        cnic:CNIC,
        description:description,
        mealDonated:0,
        amountDonated:0,
        rationDonated:0,
    });
    // res.status(200).json({
    //     success: true,
    //     message: "user added to app table",
    //     restApp 
    //   });
      tokenMaker(userApp, 201, res);   
});

export const forgetPassCheckUser = handleAsyncErr(async(req,res,next)=>{
    const {email} = req.body;
    if (!email)
    {
        return next(new HandErr("email address was not found",400));
    }
    
    // here we will first find the user 
    const userobj = await User.findOne({email});
    console.log(userobj);
    if (!userobj)
    {
        return next(new HandErr("No user found with the specific email",401))
    }
    else
    {
        res.send({
            success : true,
            message:"user found",
        });
    }
    
});

export const forgetPassUpdateUser = handleAsyncErr(async(req,res,next)=>{
    const {email,newPassword} = req.body;
    if (!email || !newPassword)
    {
        return next(new HandErr("email or new Password is missing",400));
    }
    let filter = {email:email};
    let hashPass = await bcrypt.hash(newPassword,12);
    let update = {password:hashPass};
    let updatedNgo = await User.findOneAndUpdate(filter,update);
    if (updatedNgo)
    {
        res.status(200).json({
            success:true,
            message:"Successfully updated password"
        });
    }
    else
    {
        return next(new HandErr("Error while updating the password",401));
    }
});

export const changePassUser = handleAsyncErr(async(req,res,next)=>{
    const {email,newPassword} = req.body;
    if (!email || !newPassword)
    {
        return next(new HandErr("email or password is missing",400));
    }
    let filter = {email:email};
    let hashPass = await bcrypt.hash(newPassword,12);
    let update = {password:hashPass};
    let updatedUser = await User.findOneAndUpdate(filter,update,{new:true});
    // console.log(updatedUser);
    if (updatedUser)
    {
        res.status(200).json({
            success:true,
            message:"Successfully updated password"
        });
    }
    else
    {
        return next(new HandErr("Error while updating the password",401));
    }
});


export const mealDonation = handleAsyncErr(async (req,res,next) =>{
    //user email and selected ngo will be sent from frontend
    const {address, description, image, email, ngoIdentifier} = req.body;
    console.log(req.body)
    if( !address|| !description||!image){
        return next(new HandErr("some fields are missing", 401))
    }
    // const userDonor = await User.findOne({email:email})
    // let md = userDonor.mealDonated
    // User.updateOne({email:email}, {mealDonated: md + 1})
   
    const ngoSelected = await Ngo.findOne({email:ngoIdentifier})
    
    if(!ngoSelected.isActive){
        return next(new HandErr("Ngo is inactive", 401))
    }
    const donation = Donation.create({
        donatedByUser: userDonor._id,
        acceptedBy: ngoSelected._id,
        typeOfDonation:"meal",
        donataionComplete:false,
        amount:1,
        image:image,
        address: address,
        isActive:true
    });

    res.status(200).json({
        success: true,
        message: "donation made to ngo",
        donation
      });
})

export const rationDonation = handleAsyncErr(async (req,res,next) =>{
    //user email and selected ngo will be sent from frontend
    const {address, description, image, email, ngoIdentifier} = req.body;
    console.log(req.body)
    if( !address|| !description||!image){
        return next(new HandErr("some fields are missing", 401))
    }
    // const userDonor = await User.findOne({email:email})
    // let rd = userDonor.rationDonated
    // User.updateOne({email:email}, {rationDonated: rd + 1})
   
    const ngoSelected = await Ngo.findOne({email:ngoIdentifier})
    
    if(!ngoSelected.isActive){
        return next(new HandErr("Ngo is inactive", 401))
    }
    const donation = Donation.create({
        donatedByUser: userDonor._id,
        acceptedBy: ngoSelected._id,
        typeOfDonation:"ration",
        donataionComplete:false,
        amount:1,
        image:image,
        address: address,
        isActive:true
    });

    res.status(200).json({
        success: true,
        message: "donation made to ngo",
        donation
      });
})

export const moneyDonation = handleAsyncErr(async (req,res,next) =>{
    //user email and selected ngo will be sent from frontend
    const {address, description, image, email, ngoIdentifier, amount, cardNum} = req.body;
    console.log(req.body)
    if( !address|| !description||!image|| !amount|| !cardNum){
        return next(new HandErr("some fields are missing", 401))
    }
    const userDonor = await User.findOne({email:email})
    let ad = userDonor.amountDonated
    User.updateOne({email:email}, {amountDonated: ad + amount,  bankAccount: cardNum})
   //{monetaryFundsAccepted:}
    const ngoSelected = await Ngo.findOne({email:ngoIdentifier}) 
    let aa =ngoSelected.monetaryFundsAccepted
    User.updateOne({email:email}, {monetaryFundsAccepted: aa + amount,lastUpdated:Date.now()})

    if(!ngoSelected.isActive){
        return next(new HandErr("Ngo is inactive", 401))
    }
    const donation = Donation.create({
        donatedByUser: userDonor._id,
        acceptedBy: ngoSelected._id,
        typeOfDonation:"monetary",
        donataionComplete:false,
        amount: amount,
        image:image,
        address: address
    });

    res.status(200).json({
        success: true,
        message: "donation made to ngo",
        donation
      });
})
//view account profile for actor user
export const viewUserProfile = handleAsyncErr(async (req,res,next)=>
{
    let {email} = req.body
    if(!email)
    {
        return next(new HandErr("email is missing",400));
    }
    let user = await User.findOne({'email':email, 'isActive':true},{password:0});
    console.log(user)
    if(!!user)
    {
        res.status(200).json({
            success:true,
            message:"Successfully found user profile",
            body: user
        });
    }
    else
    {
        return next(new HandErr("user profile not found or account is no longer active",400));
    }
});
//view account stats for actor user
export const viewUserStats = handleAsyncErr(async (req,res,next)=>
{
    let {email} = req.body
    if(!email)
    {
        return next(new HandErr("email is missing",400));
    }
    let userStats = await User.findOne({'email':email, 'isActive':true},{"mealDonated":1, "rationDonated":1, "amountDonated":1});
    if(!!userStats)
    {
        res.status(200).json({
            success:true,
            message:"Successfully found user stats",
            body: userStats
        });
    }
    else
    {
        return next(new HandErr("user not found",400));
    }
});

export const editProfileUser = handleAsyncErr(async (req, res, next)=>{
    const jsonFields = req.body;
    if(!jsonFields._id){
        return next(new HandErr("id missing",400));
    }
    let user = await User.findOneAndUpdate({_id: jsonFields._id, isActive:true}, jsonFields);

    if(!user){
        return next(new HandErr("user profile not found or account is no longer active",400));
    }
    res.status(200).json({
        success:true,
        message:"Successfully updated user profile",
        body: user
    });
});
