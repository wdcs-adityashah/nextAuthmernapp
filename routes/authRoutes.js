import express from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js';
import bcrypt from 'bcryptjs'
const router = express.Router();
import nodemailer from 'nodemailer'
const SECRET_KEY = 'your_secret_key';
router.post('/signup',async(req,res)=>{
       const {name,email,password} = req.body;
       if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
       }
       try {
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }
        const newUser = new UserModel({name,email,password});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);   
       } catch (err) {
        console.error('Error during registeration:',err);
        res.status(500).json({message:"Server error",error:err.message});
       }
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({message:"No record found"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Password is incorrect"})
        }
       const token = jwt.sign({name:user.name,email:user.email},SECRET_KEY,{expiresIn:'1h'})
       res.json({
        message:"success",  
        session:{
            user:{
            name:user.name,
            email:user.email
            }
        },
        token
       })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
})
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    try {
      const verified = jwt.verify(token.split(" ")[1], SECRET_KEY);
      if (!verified) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = verified;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      res.status(400).json({ message: 'Invalid token' });
    }
  };
  router.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.name}`, user: req.user });
  });
  router.post('/forgot-password',async (req,res)=>{
    const{email} = req.body;
    try {
      const user = await UserModel.findOne({email})
      if(!user){
         return res.status(400).json({message:"User not found"})
      }
      const token = jwt.sign({id:user._id},SECRET_KEY,{expiresIn:'5m'})
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aditya.shah@codezeros.com',
          pass: 'ejqo izmb necx fiub'
        }
      });
      
      var mailOptions = {
        from: 'aditya.shah@codezeros.com',
        to: email,
        subject: 'Reset Password',
        text: `http://localhost:3000/resetPassword/${token}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {

          return res.json({message:"error sending email"})
        } else {
          return res.json({status:true,message:"email sent"})
        }
      });
    } catch (error) {
      console.log(error);
    }
  
  })
  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const userId = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ status: true, message: "Password updated successfully" });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ status: false, message: "Token has expired" });
        }
        console.error("Error verifying token:", err);
        return res.status(400).json({ status: false, message: "Invalid token" });
    }
});


  router.post('/logout', (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  });

export default router