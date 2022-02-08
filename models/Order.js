const mongoose = require('mongoose')
const validator = require('validator')


const oderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [{
          name:   {type: String, required: true},
          qty:   {type: Number, required: true},
          image:   {type: String, required: true},
          price:   {type: Number, required: true},
          product:   {
              type: mongoose.Schema.ObjectId,
              ref: "Product",
              required: true,
          },
        }],

        shippingAddress: {
            fullName: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
            postalCode: {type: String, required: true},
            country: {type: String, required: true},
        },

        paymentMethod: {type: String, required: true},
        itemsPrice:   {type: Number, required: true},
        shippingPrice:   {type: Number, required: true},
        taxPrice:   {type: Number, required: true},
        totalPrice:   {type: Number, required: true},

        isPaid:   {type: Boolean, default: false},

        payedAt:   {type: Date},

        isDelivered:   {type: Boolean, default: false},
        deliveredAt:  {type: Date},

        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String
        }


    },

    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timestamps: true,
    }
);



//Populate data on find
oderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name email",
    })

    next();
});



module.exports = mongoose.model('Order', oderSchema);