import {combineReducers} from 'redux';
import Books from './books.js';
import SelectedBook from './selected.js';
import UserBooks from './userBooks.js';
import User from './user.js';
import Modal from './modal.js';
import Summary from './summary.js';
import Trade from './trade.js';
import OtherTrades from './otherTrades.js';
import Location from './location.js';
import YourRequests from './yourRequests.js';
import OtherRequests from './otherRequests.js';


const allReducers = combineReducers({
	books: Books,
	userBooks: UserBooks,
	user: User,
	selectedBook: SelectedBook,
	modal: Modal,
	summary: Summary,
	trade: Trade,
	otherTrades: OtherTrades,
	location: Location,
	otherRequests: OtherRequests,
	yourRequests: YourRequests
})

export default allReducers
