import React from 'react';
import Footer from '../components/footer.js';
import Navbar from '../components/navbar.js';
import Auth from '../javascripts/auth.js';
import {bindActionCreators} from 'redux';
import {getUser} from '../actions/index.js';
import {connect} from 'react-redux';

class Home extends React.Component{
	componentDidMount(){
		let user = (user)=>{this.props.getUser(user)};
		if(Auth.isLoggedIn()){
			let userData = {
				id: Auth.currentUserId(),
				username: Auth.currentUserName(),
			}
			user(userData);
		}else{
			user(null)
		}
	}
	logOut(){
		let user = (user)=>{this.props.getUser(user)};
		Auth.logOut();
		user(null)
	}
	buttons(){
		if(!Auth.currentUserName()){
			return(
				<div className='button container'>
					<a href='/#/allbooks'><button className='btn btn-info'>All Books</button></a>
					<a href='/login/twitter'><button className='btn btn-info'>Sign In With Twitter</button></a>
				</div>
			)
		}else{
			return(
				<div className='button container'>
					<a href='/#/allbooks'><button className='btn btn-info'>All Books</button></a>
					<a href={`/#/profile/${Auth.currentUserName()}`}><button className='btn btn-info'>My Library</button></a>
				</div>
			)
		}
	}
	render(){
		return(
			<div>
				<Navbar classType='navbar-home' logOut={this.logOut.bind(this)} currentUser={this.props.user} />
				<div className='home'>
				</div>
					<div className='home-header'>
						<h1 className='home-title'>BookSwap</h1>
						<p>Catalogue and share your library and trade with other users</p>
						{this.buttons()}
					</div>
				<Footer />
			</div>
		)
	}
}

const mapStateToProps = (state)=>{
	return{
		user: state.user
	}
}

const matchDispatchToProps = (dispatch)=>{
	return bindActionCreators({
		getUser: getUser
	}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Home);