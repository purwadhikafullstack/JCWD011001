const db = require("../../models")
const user = db.User
const bcrypt = require("bcrypt")


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
    }
}

module.exports = profileController