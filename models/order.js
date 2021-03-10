const { Schema, model } = require('mongoose')
const user = require('./user')

const order = new Schema({

    products: [
        {
            quantity: {
                type: Number,
                required: true
            },
            _id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }
})



module.exports = model('Order', order)