const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const nodemailer = require("nodemailer");
const randomString = require("randomstring");



const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({

            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }

        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For reset Password',
            html: '<p> Hi ' + name + ', Please click Here to <a href="http://127.0.0.1:3000/api/reset-password?token=' + token + '"> Reset </a>  your Password.</p>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email has been sent: -', info.response)
            }
        })


    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}


const securePassword = async (password) => {
    try {
        const passwordHas = await bcryptjs.hash(password, 10);
        return passwordHas;

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// auth token

const createToken = async (id) => {
    try {
        const tokenDta = await jwt.sign({ _id: id }, config.secretJwt);
        return tokenDta;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const registerUser = async (req, res) => {
    try {

        const data = req.body;
        const password = data.password;
        const securePass = await securePassword(password);

        const user = new User({
            name: data.name,
            email: data.email,
            password: securePass,
            image: req.file.filename,
            mobile: data.mobile,
            type: data.type
        });
        const userData = await User.findOne({ email: data.email });

        if (userData) {
            res.status(200).send({ success: false, message: "User already exist " })
        } else {

            const user_data = await user.save();
            res.status(200).send({ success: true, message: "User Registration Successfully", data: user_data })
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
};

const userLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userDta = await User.findOne({ email: email });
        if (userDta) {

            const matchPassword = await bcryptjs.compare(password, userDta.password);
            if (matchPassword) {

                const tokenDta = await createToken(userDta._id);

                const userResult = {
                    _id: userDta._id,
                    name: userDta.name,
                    email: userDta.email,
                    phone: userDta.phone,
                    password: userDta.password,
                    image: userDta.image,
                    type: userDta.type,
                    token: tokenDta
                }
                const response = {
                    success: true,
                    message: "User Details",
                    data: userResult
                }

                res.status(200).send(response)
            } else {
                res.status(200).send({ success: "false", message: "1email and password wrong!" });
            }

        } else {
            res.status(200).send({ success: "false", message: "2email and password wrong!" });
        }

    } catch (error) {
        //    res.status(400).send(error.message);
        console.log(error.message)
    }
}

const updatePassword = async (req, res) => {
    try {

        const user_id = req.body.user_id;
        const password = req.body.password;

        const userDta = await User.findOne({ _id: user_id });

        if (userDta) {
            const newPassword = await securePassword(password);
            const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                $set: {
                    password: newPassword,
                }
            })

            res.status(200).send({ success: true, message: "Your Password has been updated" })

        } else {
            res.status(400).send({ success: false, message: "User not found" })
        }

    } catch (error) {
        res.status(400).send({ success: false, message: "password update failed" });
    }
}
const forgetPassword = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.body.email });

        if (userData) {
            const ramString = randomString.generate();
            const data = await User.updateOne({ email: req.body.email }, { $set: { token: ramString } });

            sendResetPasswordMail(userData.name, userData.email, ramString);

            res.status(200).send({ success: true, message: "Please check your email and reset your password" })

        } else {
            res.status(200).send({ success: false, message: "this user doesn't exists" })
        }

    } catch (error) {
        res.status(400).send({ success: false, message: "forget Password failed" })
    }
}


const resetPassword = async (req, res) => {
    try {

        const token = req.query.token;
        const TokenData = await User.findOne({ token: token });
        if (TokenData) {


            const password = req.body.password;
            const hasPassword = await securePassword(password);

            const userData = await User.findByIdAndUpdate({ _id: TokenData._id }, { $set: { password: hasPassword, token: "" } }, { new: true });
            res.status(200).send({ success: true, message: "User Password Has Been reset", data: userData });


        } else {
            res.status(200).send({ success: true, message: "this token already expired" })
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}












module.exports = {
    registerUser, userLogin, updatePassword, forgetPassword, resetPassword
}