import React from 'react';
import Footer from '../components/footer.js';
import Navbar from '../components/navbar.js';
import BookList from '../components/booklist.js';
import Modal from 'react-modal';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
	deleteBook, 
	selectedBook, 
	getUserBooks, 
	getUser, 
	getBooks, 
	openModal, 
	closeModal, 
	addBook, 
	summaryOpen, 
	summaryClose, 
	trades, 
	otherTrades, 
	locationOpen, 
	locationClose, 
	yourRequestsClose, 
	yourRequestsOpen, 
	otherRequestsOpen, 
	otherRequestsClose,
	changeUserTrade,
	removeOtherTrade,
	removeTrade
} from '../actions/index.js';
import Auth from '../javascripts/auth.js';
import ModalStyles from '../javascripts/modalStyle.js';


class Profile extends React.Component{
	submit(e){
		e.preventDefault();
		if(this.refs.title.value === ''){
			return
		}
		let open = data=>this.props.openModal(data);
		let data = {
			search: this.refs.title.value,
		};
		$.ajax({
			type: 'POST',
			url: '/findbook',
			data: data,
			success: (data)=>{
				this.refs.title.value = '';
				open(data)
			}
		});
	}
	componentDidMount(){
		this.getData(this.props)
	}
	componentWillReceiveProps(nextProps) {
	    if(this.props.params.id !== nextProps.params.id){
	    	this.getData(nextProps);
	    }
	}
	getData(data){
		let user = (user)=>{data.getUser(user)};
			if(Auth.isLoggedIn()){
				let userData = {
					id: Auth.currentUserId(),
					username: Auth.currentUserName(),
					state: Auth.currentUserState(),
					city: Auth.currentUserCity()
				}
				user(userData);
			}else{
				user(null)
			}
			let get = (books)=>{data.getUserBooks(books)};
			let trade = (books)=>{data.trades(books)};
			let otherTrades = (books)=>{data.getOtherTrades(books)};
			let info = {};
			if(Auth.isLoggedIn()){
				info = {
					user: data.params.id,
					currentUser: Auth.currentUserName()
				}
			}else{
				console.log('hello')
				info = {
					user: data.params.id,
					currentUser: null
				}
			}
			$.ajax({
				type: 'POST',
				url: '/getuserbooks',
				data: info,
				success: (info)=>{
					console.log(info)
					get(info.books);
					if(Auth.isLoggedIn() && this.props.params.id === Auth.currentUserName()){
						trade(info.trades);
						otherTrades(info.otherTrades);
					}else{
						trade([])
						otherTrades([])
					}
				}
			})
	}
	componentWillUnmount(){
		let close = ()=>this.props.closeModal();
		let summary = ()=>this.props.summaryClose()
		close();
		summary();
	}
	addBook(bookData){
		let add = book=>this.props.addBook(book);
		let close = ()=>this.props.closeModal();
		$.ajax({
			type: 'POST',
			url: '/books',
			data: bookData,
			success: (data)=>{
				add(data)
				close()
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		});
	}
	logOut(){
		let user = (user)=>{this.props.getUser(user)};
		Auth.logOut();
		user(null)
	}
	
	books(){
		if(!this.props.UserBooks){
			return(
				<h4>No Books in database</h4>
			)
		}else{
			return(
				<BookList add={(book)=>this.props.summaryOpen(book)} books={this.props.UserBooks} />
			)
		}
	}
	delete(book){
		let remove = index=>this.props.deleteBook(index);
		let close = ()=>this.props.summaryClose();
		let index = this.props.UserBooks.indexOf(book);
		$.ajax({
			type: 'DELETE',
			url: '/delete/'+book._id,
			success: (data)=>{
				close();
				remove(index);
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	deleteButton(user){
		if(this.props.user){
			if(Auth.currentUserName() == user){
				return(
					<div>
						<button onClick={this.delete.bind(this, this.props.summary.book)} className='btn btn-danger'>Delete Book</button><br />
					</div>
				)
			}
		}
	}
	header(){
		if(this.props.user && this.props.user.username === this.props.params.id){
			return(
				<h2>Your Library</h2>
			)
		}else{
			return(
				<h2>{this.props.params.id}'s' Library</h2>
			)
		}
	}
	form(){
		if(this.props.user && this.props.user.username === this.props.params.id){
			return(
				<form className='addForm'>
					<input type='text' ref='title' placeholder='Add a Book to Your Library'/>
					<button className='btn btn-success' type='submit' onClick={this.submit.bind(this)}>Submit</button>
				</form>
			)
		}
	}
	tradeButton(book){
		if(Auth.isLoggedIn() && book.user !== Auth.currentUserName() && book.trade === ''){
			return(
				<div>
					<button onClick={this.trade.bind(this, book)} className='btn btn-info'>Trade</button><br />
				</div>
			)
		}else if(Auth.isLoggedIn() && book.trade === Auth.currentUserName()){
			return(
				<div>
					<button onClick={this.cancelTrade.bind(this, book)} className='btn btn-danger'>Cancel Trade Request</button><br />
				</div>
			)
		}
	}
	trade(book){
		let modal = (book)=>this.props.summaryOpen(book);
		let change = (index, book)=>this.props.changeUserTrade(index, book);
		let index = this.props.UserBooks.indexOf(book);
		$.ajax({
			type: 'PUT',
			url: '/trade',
			data: {id: book._id},
			success: (data)=>{
				change(index, data)
				modal(data)
				console.log('Trade Request Initiated')
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	cancelTrade(book){
		let modal = (book)=>this.props.summaryOpen(book);
		let change = (index, book)=>this.props.changeUserTrade(index, book);
		let index = this.props.UserBooks.indexOf(book);
		$.ajax({
			type: 'PUT',
			url: '/canceltrade',
			data: {id: book._id},
			success: (data)=>{
				change(index, data)
				modal(data)
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	tradeRequests(){

		if(Auth.isLoggedIn()){
			if(this.props.trade.books && this.props.otherTrades.books && Auth.currentUserName() === this.props.params.id){
				return(
					<div className='trades'>
						<button onClick={()=>this.props.yourRequestsOpen()} className='btn btn-success'>Trades Requested By You: {this.props.otherTrades.books.length}</button>
						<button onClick={()=>this.props.otherRequestsOpen()} className='btn btn-info'>Trades Request By Others: {this.props.trade.books.length}</button>
					</div>
				)
			}
		}
	}
	showLocation(){
		if(this.props.user && Auth.currentUserName() === this.props.params.id){
			return(
				<div>	
				<button className='btn btn-info' onClick={this.locationOpen.bind(this)}>User Settings</button>
				<Modal isOpen={this.props.location.open} style={ModalStyles}>	
					<div>
						<h2>User Settings</h2>
						<div className='form-group'>
							<label htmlFor='city'>City</label>
							<input className='form-control' id='city' type='text' placeholder={Auth.currentUserCity()} defaultValue={Auth.currentUserCity()} ref='city' />
							<label htmlFor='state'>State</label>
							<input className='form-control' id='state' type='text' placeholder={Auth.currentUserState()} defaultValue={Auth.currentUserState()} ref='state' />
							<input className='form-control' type='submit' className='btn btn-info' onClick={this.location.bind(this)} />
						</div>
						<button onClick={()=>{this.props.locationClose()}} className='btn btn-success'>Close</button>
					</div>
				</Modal>
			</div>
			)
		}
	}
	location(){
		console.log(this.refs.state.value)
		let close= ()=>this.props.locationClose();
		let user = (user)=>{this.props.getUser(user)};
		let data = {
			city: this.refs.city.value,
			state: this.refs.state.value
		};
		$.ajax({
			type: 'PUT',
			url: '/location',
			data: data,
			success(data){
				let userData = {
					id: data._id,
					username: Auth.currentUserName(),
					state: Auth.currentUserState(),
					city: Auth.currentUserCity()
				}
				user(userData)
				close()
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	yourRequests(){
		let list = ''
		if(this.props.user && this.props.otherTrades && Auth.currentUserName() === this.props.params.id){
			if(this.props.otherTrades.books && this.props.otherTrades.books.length > 0){
				list = this.props.otherTrades.books.map((book)=>{
					return <div className='trade' key={this.props.otherTrades.books.indexOf(book)}>
								<p>{book.title} <a onClick={this.cancelTrade.bind(this, book)} className='cancel' href='javascript:void(0)'>x</a></p>
						   	</div>
				})
			}else{
				list = <p>You have not requested any trades at this time.</p>
			}
			return(
				<Modal isOpen={this.props.yourRequests.open} style={ModalStyles}>
					<h2>Trades Requested By You</h2>
					{list}
					<button className='btn btn-success' onClick={()=>this.props.yourRequestsClose()}>Close</button>
				</Modal>
			)
		}
	}
	otherRequests(){
		let list = ''
		if(this.props.user && this.props.trade && Auth.currentUserName() === this.props.params.id){
			if(this.props.trade.books && this.props.trade.books.length > 0){
				list = this.props.trade.books.map((book)=>{
					return <div className='trade' key={this.props.trade.books.indexOf(book)}>
								<p>
									{book.title} 
									<a onClick={this.declineTrade.bind(this, book)} className='cancel' href='javascript:void(0)'> x </a> 
									<a onClick={this.acceptTrade.bind(this, book)} className='confirm' href='javascript:void(0)'> ✓ </a>
								</p>
						   	</div>
				})
			}else{
				list = <p>No trade requests at this time.</p>
			}
			return(
				<Modal isOpen={this.props.otherRequests.open} style={ModalStyles}>
					<h2>Trades Requested By Others</h2>
					{list}
					<button className='btn btn-success' onClick={()=>this.props.otherRequestsClose()}>Close</button>
				</Modal>
			)
		}
	}
	acceptTrade(book){
		let remove = index=>this.props.deleteBook(index);
		let removeTrade = index=>this.props.removeTrade(index);
		let index;
		for(let i in this.props.UserBooks){
			if(this.props.UserBooks[i]._id === book._id){
				index = i
			}
		}
		let indexTrade = this.props.trade.books.indexOf(book);
		let data = {book: book}
		$.ajax({
			type: 'PUT',
			url: '/accepttrade',
			data: data,
			success(data){
				remove(index)
				removeTrade(indexTrade)
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	declineTrade(book){
		let remove = index=>this.props.removeTrade(index);
		let index = this.props.trade.books.indexOf(book);
		$.ajax({
			type: 'PUT',
			url: '/declinetrade',
			data: {book: book},
			success: (data)=>{
				remove(index);
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	cancelTrade(book){
		let remove = index=>this.props.removeOtherTrade(index);
		let index = this.props.otherTrades.books.indexOf(book);
		$.ajax({
			type: 'PUT',
			url: '/canceltrade',
			data: {id: book._id},
			success: (data)=>{
				remove(index);
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	locationOpen(){
		let open = ()=>this.props.locationOpen();
		open();
	}
	show(){
		document.getElementById('longSum').style.display = 'block';
		document.getElementById('shortSum').style.display = 'none';
	}
	render(){
		return(
			<div>
				<Navbar classType='navbar-all' currentUser={this.props.user} logOut={this.logOut.bind(this)}/>
				{this.header()}
				{this.form()}
				{this.tradeRequests()}
				{this.yourRequests()}
				{this.otherRequests()}
				<Modal isOpen={this.props.modal.open} style={ModalStyles}>
					<h4>Select a Book to Add to Your Collection</h4>
					<BookList add={this.addBook.bind(this)} books={this.props.modal.books} />
					<button className='btn btn-success' onClick={()=>this.props.closeModal()}>Close</button>
				</Modal>
				{this.books()}
				<Modal isOpen={this.props.summary.open} style={ModalStyles}>
					<img src={this.props.summary.book.image} /><br />
					<h2>{this.props.summary.book.title}</h2><p className='year'> ({this.props.summary.book.year})</p><hr />
					<p>Written by: </p>
					{this.props.summary.book.authors.map((author)=>{
						return(<p key={this.props.summary.book.authors.indexOf(author)}>{author}</p>)
					})}
					<p id='shortSum'>{this.props.summary.book.description.split('.')[0]}... <a href='javascript:void(0)' onClick={this.show.bind(this)}>Read More</a> </p>
					<p id='longSum'>{this.props.summary.book.description}</p><br />
					{this.deleteButton(this.props.summary.book.user)}
					{this.tradeButton(this.props.summary.book)}
					<button className='btn btn-success' onClick={()=>this.props.summaryClose()}>Close</button>
				</Modal>
				{this.showLocation()}
				<Footer />
			</div>
		)
	}
}

const mapStateToProps = (state)=>{
		if(state.books){
			return{
				UserBooks: state.userBooks,
				user: state.user,
				modal: state.modal,
				summary: state.summary,
				trade: state.trade,
				otherTrades: state.otherTrades,
				location: state.location,
				otherRequests: state.otherRequests,
				yourRequests: state.yourRequests
			}
		}else{
			return{
				UserBooks: null,
				user: state.user,
				modal: state.modal,
				summary: state.summary,
				trade: state.trade,
				otherTrades: state.otherTrades,
				location: state.location,
				otherRequests: state.otherRequests,
				yourRequests: state.yourRequests
			}
		}
}

const matchDispatchToProps = (dispatch)=>{
	return bindActionCreators({
		getUserBooks: getUserBooks, 
		selectBook: selectedBook,
		deleteBook: deleteBook, 
		getUser: getUser, 
		getBooks: getBooks,
		openModal: openModal,
		closeModal: closeModal,
		addBook: addBook,
		summaryOpen: summaryOpen,
		summaryClose: summaryClose,
		trades: trades,
		getOtherTrades: otherTrades,
		locationOpen: locationOpen,
		locationClose: locationClose,
		yourRequestsClose: yourRequestsClose,
		yourRequestsOpen: yourRequestsOpen,
		otherRequestsOpen: otherRequestsOpen,
		otherRequestsClose: otherRequestsClose,
		changeUserTrade: changeUserTrade,
		removeOtherTrade: removeOtherTrade,
		removeTrade: removeTrade
	}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Profile);