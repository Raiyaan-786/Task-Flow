import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ["Admin", "Manager", "User"], 
            default: "User" 
        },
},{timestamps: true} 
);

export const User = mongoose.model("User", userSchema);