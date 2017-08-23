import React from 'react';
import Book from './book.js';

const BookList = (props)=>{
	const list = props.books.map((book)=>{
		return <Book add = {props.add.bind(this)} key={props.books.indexOf(book)} book={book} />
	});
	return(
		<div className='books container'>
			<ul className='bookList'>
				{list}
			</ul>
		</div>
	)
}

export default BookList;
