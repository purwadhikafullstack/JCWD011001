const db = require("../../models")
const user = db.User
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const transporter = require("../helpers/transporter");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});
const URL = process.env.WHITELISTED_DOMAIN;

const profileController = {
    patchChangeName : async (req, res) => {
        try {
            const {id} = req.user
            const {currentName, newName} = req.body
            await db.sequelize.transaction( async (t) => {
                const findName = await user.update({ username: newName }, { where : {id}}, {transaction : t})
                const findUser = await user.findOne({where : {id}})
                return res.status(200).json({message : "Name successfully change", data: findUser})
            })
        } catch (error) {
            return res.status(500).json({message : "Name already exist", error : error.message})
        }
    },
    patchChangeGender : async(req,res) => {
        try {
            const {id} = req.user
            const {currentGender, chooseGender} = req.body
            await db.sequelize.transaction (async (t) => {
                const result = await user.update({gender : chooseGender}, {where : {id}}, {transaction : t})
                return res.status(200).json({message : "Success"})
            })
        } catch (error) {
            return res.status(500).json({message : "Failed, Butuh Oplas", error : error.message})
        }
    },
    patchChangeBirthdate : async ( req, res ) => {
        try {
            const {id} = req.user
            const {currentBirthdate, newBirthdate} = req.body
            await db.sequelize.transaction (async (t) => {
                const result = await user.update({birthdate : newBirthdate}, 
                    {where : {id}}, {transaction : t})
                    return res.status(200).json({message : "Success", data : result})
            })
        } catch (error) {
            return res.status(500).json({message : "Failed", error : error.message})
        }
    },
    pacthChangeEmail : async (req, res) => {
        try {
            const {id} = req.user
            const {currentEmail, newEmail} = req.body
            await db.sequelize.transaction (async (t) => {
                const result = await user.update({email : newEmail}, {where : {id}}, {transaction : t})
                return res.status(200).json({message : "Email successfully change", data : result})
            })
        } catch (error) {
            return res.status(500).json({message : "Failed", error : error.message})
        }
    },
    patchChangePassword : async (req, res) => {
        try {
            const {id} = req.user
            const {currentPassword, newPassword, confirmPassword} = req.body
            await db.sequelize.transaction (async (t) => {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(newPassword, salt)
                const result = await user.update({password : hashPassword}, {where : {id}}, {transaction : t})
                return res.status(200).json({message : "Password Successfully Change", data : result})
            })
        } catch (error) {
            return res.status(500).json({message : "Failed", error: error.message})
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const checkEmail = await user.findOne({ where: { email } })
            if (!checkEmail) {
                return res.status(404).json({message : "Email Not Found"})
            }

            let payload = {
                id: checkEmail.id,
                email: checkEmail.email,
                username: checkEmail.username,
            };

            const username = checkEmail.username;
            const userEmail = checkEmail.email;
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
            const redirect = `${URL}/reset-password/${token}`;

            const data = await fs.readFile(path.resolve(__dirname, "../emails/resetPassword.html"), "utf-8");

            const tempCompile = handlebars.compile(data);
            const tempResult = tempCompile({ username, userEmail, redirect });
            await transporter.sendMail({
              to: email,
              subject: "Reset Password",
              html: tempResult,
            });
            return res.status(200).json({ message: "Request accepted. Check your email to reset your password", token: token });
        } catch (error) {
            return res.status(500).json({message : "Failed to send request", error: error.message})
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { id, email } = req.user;
            const { newPassword, confirmPassword } = req.body;
            const checkUserData = await user.findOne({ where: { id } });
            if (!checkUserData) { return res.status(404).json({ message: "User not found" }); }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.sequelize.transaction(async (t) => {
                await user.update(
                  { password: hashedPassword },
                  { where: { id }, transaction: t }
                );

                return res.status(200).json({ message: "Password has been reset" });
            });
        } catch (error) {
            return res.status(500).json({ message: "Failed to reset your password", error: error.message });
        }
    },

    changeProfilePicture: async (req, res) => {
        try {
            const { id } = req.user;
            const oldAvatar = await user.findOne({ where: { id } });

            if (oldAvatar.profileimg) {
              fs.unlink(oldAvatar.profileimg, (err) => {
                if (err) return res.status(500).json({ error: err.message });
              });
            }

            await db.sequelize.transaction(async (t) => {
              await user.update(
                { profileimg: req.file.path },
                { where: { id } },
                { transaction: t }
              );
              res.status(200).json({ message: "Avatar changed successfully" });
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to change avatar", error: error.message });
        }
    }
}

module.exports = profileController