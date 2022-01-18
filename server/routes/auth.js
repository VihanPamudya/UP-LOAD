const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API} = require('../config/keys')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please enter all the fields!" })
    }
    User.findOne({ email: email })
        .then((saveUser) => {
            if (saveUser) {
                return res.status(422).json({ error: "User already exists with this email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedpassword,
                        pic
                    })

                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "upload.app.info@gmail.com",
                                subject: "Welcome to UP-LOAD",
                                html:
                                    `
                                <div style="
          height: 50px;
                      width: 100%;
                      background-color: lightgrey;
        ">
        <p style="
            margin: 0px;
            font-weight: bold;
            font-size: 36px;
            text-align: center;
            color: #26a69a;
          ">
            UP<span style="color: #fbc02d;">-LOAD</span>
        </p>
    </div>
    <div>
        <p style="
            text-align: center;
            font-size: 18px;
            color: black;
            font-weight: bold;
          ">
            Welcome ${user.name} to UP-LOAD
        </p>
    </div>
    <div style="height: 100px">
        <p style="margin: 10px 0px; color: #4a4a4a; text-align: center">
            UP-LOAD is an app that allows us to share our images with people all over the world. 
            It is very similar to other social media apps that we use nowadays. Our solution, 
            like the Instagram app, comes pre-loaded with all features and functionality.
        </p>
    </div>
    <div style="
        background-color: lightgray;
        color: black;
        width: 100%;
        padding: 5px 0px;
      ">
        <p style="margin: 0px; text-align: center">
            Copyright 2022 UP-LOAD. All Rights Reserved
        </p>
    </div>
                                `
                            })
                            res.json({ message: "User saved successfully!" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter all the fields!" })
    }
    User.findOne({ email: email })
        .then((saveUser) => {
            if (!saveUser) {
                return res.status(422).json({ error: "Please enter valid email or password!" })
            }
            bcrypt.compare(password, saveUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: saveUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = saveUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        return res.status(422).json({ error: "Please enter valid email or password!" })
                    }
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesn't exist with the entered Email!" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "upload.app.info@gmail.com",
                        subject: "UP-LOAD - Reset Your Password",
                        text: 'body text',
                        html: `
                    <div
                    style="
                      height: 50px;
                      width: 100%;
                      background-color: lightgrey;
                    "
                  >
                    <p
                      style="
                        margin: 0px;
                        font-weight: bold;
                        font-size: 36px;
                        text-align: center;
                        color: #26a69a;
                      "
                    >
                      UP<span style="color: #fbc02d;">-LOAD</span>
                    </p>
                  </div>
                  <p style="color: #4a4a4a;">You Requested for a Password Reset</p>
                  <p style="color: #4a4a4a;">
                    Click this <a href="http://localhost:3000/reset/${token}">Link</a> to reset
                    your Password
                  </p>
                  <div
                  style="
                    color: black;
                    width: 100%;
                    padding: 5px 0px;
                    background-color: lightgray;
                  "
                >
                  <p style="margin: 0px; text-align: center">
                    Copyright 2022 UP-LOAD. All Rights Reserved
                  </p>
                </div>
                    `
                    })
                    res.json({ message: "Check your Email to reset your password!" })
                })

            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Session expired.Please try again!" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "Password Updated Successfully!" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})
module.exports = router