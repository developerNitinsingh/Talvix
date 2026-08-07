import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
