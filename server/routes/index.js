'use strict';

const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const jwt = require('express-jwt');
const router = express.Router();
const Book = mongoose.model('Book');
const User = mongoose.model('User');
const google = require('googleapis');
const books = google.books('v1');
require('../twitter/twitter.js');
const secret = process.env.SECRET;
const Auth = jwt({secret: secret, userProperty: 'payload'});

const API_KEY = process.env.API_KEY;

const setTokenCookie = (req, res)=> {
	let token = req.user.generateJWT();
	res.cookie('token', JSON.stringify(token))
	res.redirect('/');
}

router.get('/getbooks', (req, res)=>{
	Book.find((err, books)=>{
		if(err){return err};
		res.json(books);
	});
});

router.post('/getuserbooks', (req, res)=>{
	Book.find({
		user: req.body.user
	}, (err, books)=>{
		let trades = [];
		let otherTrades = [];
		if(req.body.currentUser){
			Book.find({
				trade: req.body.currentUser
			}, (err, othertrades)=>{
				otherTrades = othertrades;
				for(let i in books){
					if(books[i].trade !== ''){
						trades.push(books[i])
					}
				}
				let data = {books: books, trades: trades, otherTrades: otherTrades}
				res.json(data)
			})
		}else if(!req.body.currentUser){
			let data = {books: books}
			res.json(data)
		}
	})
});

router.post('/findbook', (req, res)=>{
	books.volumes.list({
		auth: API_KEY,
		q: req.body.search
	}, (err, data)=>{
		if(err){console.log(err)};
		let bookData = [];
		data.items.map((book)=>{
			let newBook = {
				title: book.volumeInfo.title,
				authors: book.volumeInfo.authors,
				year: new Date(book.volumeInfo.publishedDate).getUTCFullYear(),
				description: book.volumeInfo.description || ''
			}
			if(book.searchInfo){
				newBook.snippet = book.searchInfo.textSnippet || ''
			}else{
				newBook.snippet = ''
			}
			if(book.volumeInfo.imageLinks){
				newBook.image = book.volumeInfo.imageLinks.thumbnail
			}else{newBook.image = ''}
			bookData.push(newBook);
		})
		res.json(bookData)
	})
});

router.post('/books', Auth, (req, res, next)=>{
	let book = new Book;
	book.title = req.body.title;
	book.authors = req.body.authors;
	book.year = req.body.year;
	book.description = req.body.description;
	book.snippet = req.body.snippet;
	book.image = req.body.image;
	book.user = req.payload.username;
	book.trade = '';
	book.save((err, book)=>{
		if(err){return next(err);}
		User.findOne({_id: req.payload._id}, (err, user)=>{
			if(err){return err}
			user.books.push(book._id)
			user.save((err, user)=>{
				if(err){return err}
			})
		})
		res.json(book);
	});
});

router.delete('/delete/:id', Auth, (req, res)=>{
	let id = req.params.id;
	Book.findOne({_id: id}, (err, book)=>{
		if(book.user != req.payload.username){
			return res.status(401).send('Unauthorized')
		}else{
			Book.remove({_id: id}, (err)=>{
				User.findOne({_id: req.payload._id}, (err, user)=>{
					let index = user.books.indexOf(id);
					user.books.splice(index, 1);
					user.save((err, user)=>{
						if(err){return err}
					});
				});
				if(err){res.json(err)};
				res.send('success')
			})
		}
	})
})

router.put('/trade', Auth, (req, res)=>{
	Book.findOne({_id: req.body.id}, (err, book)=>{
		book.trade = req.payload.username;
		book.save((err, book)=>{
			if(err){res.json(err)};
			User.findOne({_id: req.payload._id}, (err, user)=>{
				user.trades.push(req.body.id);
				user.save((err, user)=>{
					if(err){return err}
					res.json(book)
				});
			})
		})
	})
})

router.put('/canceltrade', Auth, (req, res)=>{
	Book.findOne({_id: req.body.id}, (err, book)=>{
		book.trade = '';
		book.save((err, book)=>{
			if(err){res.json(err)};
			User.findOne({_id: req.payload._id}, (err, user)=>{
				let index = user.trades.indexOf(req.body.id);
				user.trades.splice(index, 1);
				user.save((err, user)=>{
					if(err){return err}
					res.json(book)
				})
			})
		})
	})
})

router.put('/declinetrade', Auth, (req, res)=>{
	Book.findOne({_id: req.body.book._id}, (err, book)=>{
		book.trade = '';
		book.save((err, book)=>{
			if(err){return err};
			User.findOne({twitterUsername: req.body.book.trade}, (err, user)=>{
				let index = user.trades.indexOf(book._id);
				user.trades.splice(index, 1);
				user.save((err, user)=>{
					if(err){return err}
					res.json(book)
				})
			})
		})
	})
})

router.put('/accepttrade', Auth, (req, res)=>{
	Book.findOne({_id: req.body.book._id}, (err, book)=>{
		book.user = req.body.book.trade;
		book.trade = '';
		book.save((err, book)=>{
			if(err){res.json(err)};
			User.findOne({twitterUsername: req.body.book.trade}, (err, user)=>{
				let index = user.trades.indexOf(book._id);
				user.trades.splice(index, 1);
				user.save((err, user)=>{
					if(err){return err}
					res.json(book)
				})
			})
		})
	})
})

router.put('/location', Auth, (req, res)=>{
	User.findOne({_id: req.payload._id}, (err, user)=>{
		user.city = req.body.city;
		user.state = req.body.state;
		user.save((err, user)=>{
			if(err){return err}
			let token = user.generateJWT();
			res.cookie('token', JSON.stringify(token))
			res.json(user);
		})
	})
})

router.get('/login/twitter', passport.authenticate('twitter'));

router.get('/login/twitter/return', passport.authenticate('twitter', {
	failureRedirect: '/',
	session: false
}), setTokenCookie);

module.exports = router;
