const path = require('path')
const fs = require('fs')
const main = require.main.path
const bagPath = path.join(
    main, 'data', 'bag.json'
)
class Card {
    constructor() {

    }
    static async add(product) {
        const bag = await Card.fetch()
        const productIdx = bag.products.findIndex(el => el.id === product.id)
        const icncludesProduct = bag.products[productIdx]
        if (icncludesProduct) {
            bag.quantity += 1
            icncludesProduct.quantity += 1
            bag.price += +product.price
        } else {
            product.quantity = 1
            bag.products.push(product)
            bag.quantity += 1
            bag.price += +product.price
        }


        // if (productIdx > -1) {
        //     console.log(bag.products[productIdx]);
        //     bag.products[productIdx] = { ...bag.products[productIdx], "quantity": bag.products[productIdx].quantity + 1 }
        //     bag.quantity += 1
        // } else {
        //     bag.products.push({ ...product, "quantity": +1 })
        // }
        return new Promise((resolve, reject) => {
            fs.writeFile(bagPath, JSON.stringify(bag), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(bagPath, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })


        })
    }
    static async remove(id) {
        const bag = await Card.fetch()
        const ind = bag.products.findIndex(el => el.id === id)
        if (bag.products[ind].quantity > 1) {
            bag.products[ind].quantity -= 1
            bag.quantity -= 1
            bag.price -= +bag.products[ind].price
        }
        else {
            bag.price -= +bag.products[ind].price
            bag.products.splice(ind, 1)
            bag.quantity -= 1
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(bagPath, JSON.stringify(bag), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(bag)
                }
            })
        })
    }
}

module.exports = Card