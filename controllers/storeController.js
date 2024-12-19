const express = require('express');
const Store = require('../models/storeModel');
const User = require('../models/userModel');



const createStore = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.body.vendor_id });
        if (userData) {
            if (!req.body.latitude || !req.body.longitude) {
                res.status(200).send({ success: false, message: "lat anf long is not found" });
            } else {
                const vendorData = await Store.findOne({ vendor_id: req.body.vendor_id });
                if (vendorData) {
                    res.status(200).send({ success: false, message: "This vendor already have store" });
                } else {
                    const store = new Store({
                        vendor_id: req.body.vendor_id,
                        logo: req.file.filename,
                        business_email: req.body.business_email,
                        address: req.body.address,
                        pin: req.body.pin,
                        location:{
                            type:"Path",
                            coordinates:[parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
                        }

                    });
                    const storeData = await store.save();
                    res.status(200).send({success:true, message:"Store has been create successfully!", data:storeData});
                    

                }

            }
        } else {
            res.status(200).send({ success: false, message: "Vendor id no found" });
        }

    } catch (error) {
        res.status(200).send(error.message);
    }
}








module.exports = {
    createStore,
}