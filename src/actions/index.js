export const deleteBook = (index)=>{
	return{
		type: 'BOOK_DELETED',
		payload: index
	}
};

export const deletedBook = (index)=>{
	return{
		type: 'DELETE_BOOK',
		payload: index
	}
}

export const getBooks = (books)=>{
	return{
		type: 'GET_BOOKS',
		payload: books
	}
};

export const addBook = (book)=>{
	return{
		type: 'ADD_BOOK',
		payload: book
	}
};

export const getUserBooks = (books)=>{
	return{
		type: 'USER_BOOKS',
		payload: books
	}
};
 export const selectedBook = (book)=>{
 	return{
 		type: 'SELECT_BOOK',
 		payload: book
 	}
 };

 export const getUser = (user)=>{
 	return{
 		type: 'GET_USER',
 		payload: user
 	}
 };

 export const searchBooks = (books)=>{
 	return{
 		type: 'SEARCH_BOOKS',
 		payload: books
 	}
 }

 export const openModal = (books)=>{
 	return{
 		type: 'OPEN_MODAL',
 		payload: {
 			books: books,
 			open: true
 		}
 	}
 }

 export const closeModal = ()=>{
 	return{
 		type: 'CLOSE_MODAL',
 		payload: {
 			books: [],
 			open: false
 		}
 	}
 }

 export const summaryOpen = (book)=>{
 	return{
 		type: 'OPEN_SUMMARY',
 		payload: {
 			book: book,
 			open: true
 		}
 	}
 }

 export const summaryClose = ()=>{
 	return{
 		type: 'CLOSE_SUMMARY',
 		payload: {
 			book: {authors: []},
 			open: false
 		}
 	}
 }

 export const trades = (trades)=>{
 	return{
 		type: 'TRADES',
 		payload: {
 			books: trades
 		}
 	}
 }

 export const otherTrades = (trades)=>{
 	return{
 		type: 'OTHER_TRADES',
 		payload: {
 			books: trades
 		}
 	}
 }

 export const locationOpen = ()=>{
 	return{
 		type: 'LOCATION_OPEN',
 		payload: {
 			open: true
 		}
 	}
 }

 export const locationClose = ()=>{
 	return{
 		type: 'LOCATION_CLOSE',
 		payload: {
 			open: false
 		}
 	}
 }

 export const yourRequestsOpen = ()=>{
 	return{
 		type: 'YOUR_REQUESTS_OPEN',
 		payload: {
 			open: true
 		}
 	}
 }

  export const yourRequestsClose = ()=>{
 	return{
 		type: 'YOUR_REQUESTS_CLOSE',
 		payload: {
 			open: false
 		}
 	}
 }

 export const otherRequestsOpen = ()=>{
 	return{
 		type: 'OTHER_REQUESTS_OPEN',
 		payload: {
 			open: true
 		}
 	}
 }

 export const otherRequestsClose = ()=>{
 	return{
 		type: 'OTHER_REQUESTS_CLOSE',
 		payload: {
 			open: false
 		}
 	}
 }

 export const changeTrade = (index, book)=>{
 	return{
 		type: 'CHANGE_TRADE',
 		payload: {
 			index: index,
 			book: book
 		}
 	}
 }

 export const changeUserTrade = (index, book)=>{
 	return{
 		type: 'CHANGE_USER_TRADE',
 		payload: {
 			index: index,
 			book: book
 		}
 	}
 }

 export const removeOtherTrade = (index)=>{
 	return{
 		type: 'REMOVE_OTHER_TRADE',
 		payload: index
 	}
 }

 export const removeTrade = (index)=>{
 	return{
 		type: 'REMOVE_TRADE',
 		payload: index
 	}
 }
 