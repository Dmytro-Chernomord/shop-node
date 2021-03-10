const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    bag: {
        items: [
            {
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Course'
                }
            },
        ]
    }
})
userSchema.methods.addToBag = function (course) {
    const cloneItems = [...this.bag.items]
    const idx = cloneItems.findIndex(el => {
        return el.courseId.toString() === course._id.toString()
    })
    if (idx >= 0) {
        cloneItems[idx].quantity = cloneItems[idx].quantity + 1;
    } else {
        cloneItems.push({
            courseId: course._id,
            quantity: 1
        })
    }
    // const newBag = { items: cloneItems }
    // this.bag = newBag

    this.bag = { items: cloneItems }
    return this.save()
}

userSchema.methods.clearBag = function () {
    this.bag = { items: [] }
    return this.save()
}
userSchema.methods.removeFromProduct = function (id) {
    const items = [...this.bag.items];
    const idx = items.findIndex(el => {
        return el.courseId.toString() === id.toString()
    })
    if (items[idx]?.quantity > 1) {
        items[idx].quantity -= 1
    } else {
        items.splice(idx, 1)
    }
    this.bag = { items }
    return this.save()
}

module.exports = model('User', userSchema)