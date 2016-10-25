import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, useRouterHistory } from 'react-router';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {createHashHistory } from 'history';
import $ from 'jquery';
import Home from './containers/home.js';
import AllBooks from './containers/allbooks.js';
import Profile from './containers/profile.js';
import allReducers from './reducers/index.js';
import 'bootstrap-webpack';
import './styles/styles.scss';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});


const store = createStore(allReducers, window.devToolsExtension && window.devToolsExtension());

ReactDOM.render(
	(<Provider store={store}>
		<Router history={appHistory}>
			<Route path="/" component={Home} />
			<Route path="/allbooks" component={AllBooks} />
			<Route path="/profile/:id" component={Profile} />
		</Router>
	</Provider>
	),
	document.getElementById('app')
);