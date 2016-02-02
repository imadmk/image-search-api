'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var mongodb = require('mongodb').MongoClient;

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route('/api/latest/imagesearch/')
		.get(function (req, res) {
			var url = process.env.MONGO_URI;
			mongodb.connect(url, function (err, db) {
				var collection = db.collection('searches');
				var cursor = collection.find({}, {_id: 0, whenint: 0});
				
				cursor.sort({whenint: -1});
				cursor.limit(10);
				
				cursor.toArray(function (err, searches) {
					res.json(searches);
				});
			});
		});
		
	app.route('/api/imagesearch/:keywords')
		.get(function (req, res) {
			var searchService = require('../services/googlesearchService')();
			var keywords = req.params.keywords;
			var offset = req.query.offset;
			
			var url = process.env.MONGO_URI;
			mongodb.connect(url, function (err, db) {
				var collection = db.collection('searches');
				var dateint = Date.now();
				var date = new Date(dateint);
				
				collection.insertOne({
					keywords: req.params.keywords,
					when: date.toUTCString(),
					whenint: dateint
				}, function (err, input) {
					searchService.search(keywords, offset,
						function (err, results) {
							res.json(results);
						});
				});
			});
		});
	
};
