const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../models");
const user = db.User

require("dotenv").config({ path: path.resolve("../.env") });

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send("Belum Login");
  try {
    token = token.split(" ")[1];
    if (token === "null" || !token) return res.status(401).send("access denied");
    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    if (!verifiedUser) return res.status(401).send("unauthorized request");
    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(400).send("Token Expired");
  }
};

const verifyName = async (req, res, next) => {
    const {id,username} = req.user
    const isUsernameExist = await user.findOne({
        where : { 
            id 
        }
    })
    if(!isUsernameExist){
        return res.status(200).json({message: "Username not found"})
    }
        next();
}
const verifyEmail = async (req, res, next) => {
    const {id,email} = req.user
    const {currentEmail, newEmail} = req.body
    const isEmailExist = await user.findOne({
        where : {
            id
        }
    })
    if(!isEmailExist){
        return res.status(500).json({
            message : "Invalid Email"
        })
    }
    next();
}
const verifyPassword = async (req, res, next) => {
    const {id} = req.user
    const {currentPassword, newPassword, confirmPassword} = req.body
    const account = await user.findOne({where : {id}})
    const checkPassword = await bcrypt.compare(currentPassword, account.password)

    if(!checkPassword) return res.status(500).json({message : "Incorrect Password"})
    if(currentPassword === newPassword)
            return res.status(500).json({
                message : "Old password cannot be same as new password"
            })
    const users = await user.findOne({
            where : {id}
        })
        const checkOldPassword = await bcrypt.compare(currentPassword, users.password)
    if(!checkOldPassword)return res.status(500).json({message : "Incorrect password"})
    next();
}

module.exports = { verifyToken, verifyName, verifyEmail, verifyPassword };
