'use strict';

const mongoose = require('mongoose');
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	twitterId: String,
	twitterToken: String,
	twitterUsername: String,
	twitterDisplayName: String,
	books: [String],
	trades: [String],
	state: String,
	city: String,
	name: String
})

UserSchema.methods.generateJWT = function(){
	let today = new Date();
	let exp = new Date(today);
	exp.setDate(today.getDate() + 5);

	return jwt.sign({
		_id: this._id,
		username: this.twitterUsername,
		city: this.city,
		state: this.state,
		exp: parseInt(exp.getTime() / 1000)
	}, secret)
};

mongoose.model('User', UserSchema);