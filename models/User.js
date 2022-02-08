const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const validator = require('validator')


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, " name field is required"],
            maxlength: [20, "name cannot be more than 20 characters"],
            minlength: [4, "name must have at least 5 characters"],
            /*validate: [
                validator.isAlphanumeric,
                "Username must have not contain any special Characters or spaces",
            ],
            match: [/^[a-zA-Z][A-Za-z0-9_]*$/, "Username cannot begin with a number"],*/
        },

        email: {
            type: String,
            unique: true,
            required: [true, "Email field is required"],
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },


        password: {
            select: false,
            type: String,
            minlength: [8, "Password must have at least 8 character"],
            required: [true, "Password field is required"],
            match: [
                /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                "Password must Contain at least a number, and a special character",
            ],
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        role: {
            type: String,
            default: 'user',
            enum: {
                values: ['admin', 'user'],
                message: 'Role can be either user or admin'
            }
        },

        isEmailVerify: {
            status: {type: Boolean, default: false},
            verifiedAt: {
                type: Date,
            },
        },

        passwordChangedAt: Date,

        registrationToken: String,

        registrationTokenExpiredAt: Date,

        resetPasswordToken: String,

        resetPasswordTokenExpiredAt: Date,
    },

    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timestamps: true,
    }
);


//Match user password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expire time
    this.resetPasswordTokenExpiredAt = Date.now() + 30 * 60 * 1000

    return resetToken;
}


//Sign JWT and return token
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};


// Generate activation token
userSchema.methods.getRegistrationToken = function () {
    // Generate token
    const activationToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken field
    this.registrationToken = crypto
        .createHash("sha256")
        .update(activationToken)
        .digest("hex");

    // Set token expire time
    this.registrationTokenExpiredAt = Date.now() + 30 * 60 * 1000;

    return activationToken;
};



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model('User', userSchema);