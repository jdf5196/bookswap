import React from 'react';
import Footer from '../components/footer.js';
import Navbar from '../components/navbar.js';
import BookList from '../components/booklist.js';
import Modal from 'react-modal';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {deletedBook, selectedBook, getBooks, getUser, summaryOpen, summaryClose, changeTrade} from '../actions/index.js';
import Auth from '../javascripts/auth.js';
import ModalStyles from '../javascripts/modalStyle.js';

class AllBooks extends React.Component{
	componentDidMount(){
		let get = (books)=>{this.props.getBooks(books)};
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
		$.get('/getbooks', (data)=>{
			get(data);
		});
	}
	componentWillUnmount(){
		let close = ()=>this.props.summaryClose();
		close();
	}
	logOut(){
		let user = (user)=>{this.props.getUser(user)};
		Auth.logOut();
		user(null)
	}
	books(){
		if(this.props.books.length < 1){
			return(
				<h4>No Books in database</h4>
			)
		}else{
			return(
				<BookList add={(book)=>this.props.summaryOpen(book)} books={this.props.books} />
			)
		}
	}
	delete(book){
		let remove = index=>this.props.deleteBook(index);
		let close = ()=>this.props.summaryClose();
		let index = this.props.books.indexOf(book);
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
		let change = (index, book)=>this.props.changeTrade(index, book);
		let index = this.props.books.indexOf(book)
		$.ajax({
			type: 'PUT',
			url: '/trade',
			data: {id: book._id},
			success: (data)=>{
				change(index, data)
				modal(data);
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		})
	}
	cancelTrade(book){
		let modal = (book)=>this.props.summaryOpen(book)
		let change = (index, book)=>this.props.changeTrade(index, book);
		let index = this.props.books.indexOf(book);
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
	show(){
		document.getElementById('longSum').style.display = 'block';
		document.getElementById('shortSum').style.display = 'none';
	}
	render(){
		return(
			<div>
				<Navbar classType='navbar-all' logOut={this.logOut.bind(this)} currentUser={this.props.user} />
				<h2 className='allHeader'>Browse All Books</h2>
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
					<p>This book is owned by: <a href={`/#/profile/${this.props.summary.book.user}`}>{this.props.summary.book.user}</a></p>
					{this.deleteButton(this.props.summary.book.user)}
					{this.tradeButton(this.props.summary.book)}
					<button className='btn btn-success' onClick={()=>this.props.summaryClose()}>Close</button>
				</Modal>
				<Footer />
			</div>
		)
	}
}

const mapStateToProps = (state)=>{
		if(state.books){
			return{
				books: state.books,
				user: state.user,
				summary: state.summary
			}
		}else{
			return{
				books: null,
				user: state.user,
				summary: state.summary
			}
		}
}

const matchDispatchToProps = (dispatch)=>{
	return bindActionCreators({
		getBooks: getBooks, 
		selectBook: selectedBook,
		deleteBook: deletedBook, 
		getUser: getUser, 
		summaryOpen: summaryOpen,
		summaryClose: summaryClose,
		changeTrade: changeTrade
	}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(AllBooks);
