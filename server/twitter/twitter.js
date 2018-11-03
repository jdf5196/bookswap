'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
const Strategy = require('passport-twitter').Strategy;
require('../models/user.js');
const User = mongoose.model('User');

passport.serializeUser((user, done)=>{
	done(null, user.id);
});

passport.deserializeUser((id, done)=>{
	User.findById(id, (err, user)=>{
		done(err, user);
	});
});

passport.use(new Strategy({
	consumerKey: process.env.consumerKey || Secret.consumer_key,
	consumerSecret: process.env.consumerSecret || Secret.consumer_secret,
	callbackURL: 'http://jdf-bookswap.herokuapp.com/login/twitter/return'
},
	(token, tokenSecret, profile, done)=>{
		process.nextTick(()=>{
			User.findOne({twitterId: profile.id}, (err, user)=>{
				if(err){
					return done(err);
				}
				if(user){
					return done(null, user);
				}else{
					let user = new User();
					user.twitterId = profile.id;
					user.twitterToken = token;
					user.twitterUsername = profile.username;
					user.twitterDisplayName = profile.displayName;
					user.books = [];
					user.city = '';
					user.state = '';
					user.save((err)=>{
						if(err){
							throw err;
						}else{
							return done(null, user)
						}
					})
				}
			})
		})
	}
));