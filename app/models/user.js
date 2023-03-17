//model singular, table or collection-plural
const mongoose = require('mongoose');

const Schema = mongoose.Schema //S is capital that is storing a class or constructor in it

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: { type: String, default: 'customer'},
    // description: { type: String},
},{timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User