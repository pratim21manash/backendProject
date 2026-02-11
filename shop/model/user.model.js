const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["admin", "manager", "staff"],
            default: "staff"
        },
        storeName: {
            type: String,
            trim: true,
            default: "My Store"
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {

    const count = await model("User").countDocuments({
        email: this.email
    });

    if (count > 0) {
        throw new Error("Email already exists");
    }

    const encryptedPassword = await bcrypt.hash(
        this.password.toString(),
        12
    );

    this.password = encryptedPassword;
});



const UserModel = model("User", userSchema);
module.exports = UserModel