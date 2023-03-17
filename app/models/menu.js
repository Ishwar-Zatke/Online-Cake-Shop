//model singular, table or collection-plural
const mongoose = require('mongoose');

const Schema = mongoose.Schema //S is capital that is storing a class or constructor in it

const menuSchema = new Schema({
    name: { type: String, required: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    size: { type: String, required: true},
})

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu
