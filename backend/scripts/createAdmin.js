const mongoose = require('mongoose');
require("dotenv").config();

const User = require("../models/User");
const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const existingAdmin = await User.findOne({ role: "Admin" });
        if (existingAdmin) {
            console.log('admin already exist', existingAdmin.email);
            return;
        }
        const admin = await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "Admin"
            
        })
        console.log("Admin created successsfully", admin.email);
    } catch (error) {
        console.error("Admin creation is failed", error.message);
            
    }
    finally {
        await mongoose.disconnect();
    }
};
createAdmin();