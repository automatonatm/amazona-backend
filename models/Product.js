const mongoose = require('mongoose')
const validator = require('validator')


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        countInStock: {
            type: Number,
            min: [0, 'Count in stock must be at least 1'],
        },

        price: {
            type: Number,
            required: true,
            min: [10, 'Price must be at least 10'],
        },

        description: {
            type: String,
            required: true,
            minLength: [10, "Description is too short"]

        },

        brand: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        }


    },

    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timestamps: true,
    }
);




module.exports = mongoose.model('Product', productSchema);