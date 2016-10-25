import React from 'react';

const Navbar = (props) => {
	const classes = `navbar navbar-inverse navbar-fixed-top ${props.classType}`;
	const listClasses = `nav navbar-nav navbar-inverse ${props.classType}`;
	const loggedIn = ()=>{
		if(!props.currentUser){
			return <ul className={listClasses}>
						<li><a href='/#/allbooks' data-toggle='collapse' data-target='.in'>All Books</a></li>
						<li><a href='/login/twitter' data-toggle='collapse' data-target='.in'><img src='/images/sign-in-with-twitter.png' /></a></li>
					</ul>
		}else{
			return <ul className={listClasses}>
						<li><a href='/#/allbooks' data-toggle='collapse' data-target='.in'>All Books</a></li>
						<li><a href={`/#/profile/${props.currentUser.username}`} data-toggle='collapse' data-target='.in'>{props.currentUser.username}</a></li>
				   		<li><a href='#' onClick={props.logOut.bind(this)} data-toggle='collapse' data-target='.in'>Logout</a></li>
				   	</ul>
		}
	}
	return(
		<div>
			<nav className={classes}>
				<div className='container'>
					<div className='navbar-header'>
						<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#collapse">
        					<span className="sr-only">Toggle navigation</span>
        					<span className="sr-only">Toggle navigation</span>
        					<span className="glyphicon glyphicon-align-justify"></span>
  						</button>
						<a href='/#/' className='navbar-brand'>BookSwap</a>
					</div>
					<div className='collapse navbar-collapse' id='collapse'>
						{loggedIn()}
					</div>
				</div>
			</nav>
			<div className='push'></div>
		</div>
	)
}

export default Navbar;