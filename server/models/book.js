const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	title: String,
	authors: Array,
	year: String,
	description: String,
	snippet: String,
	image: String,
	user: String,
	trade: String
});

mongoose.model('Book', BookSchema);