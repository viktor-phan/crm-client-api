const express = require("express")
const router = express.Router()


router.all("/", (req, res, next)  =>{
    res.json({message: "User router"})
})


module.exports =router;