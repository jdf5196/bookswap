import React from 'react';

const Book = (props)=>{
	return(
		<li className='book'>
			<img title={props.book.title} onClick={props.add.bind(this, props.book)} src={props.book.image} />
		</li>
	)
}

export default Book;
