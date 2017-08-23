const initialState = {
	open: false,
	book: {authors: [], description: ''}
};

export default (state=initialState, action)=>{
	switch(action.type){
		case 'OPEN_SUMMARY':
			document.querySelector('body').classList.add('modal-open');
			document.querySelector('html').classList.add('modal-open');
			return state = action.payload
		case 'CLOSE_SUMMARY':
			document.querySelector('body').classList.remove('modal-open');
			document.querySelector('html').classList.remove('modal-open');
			return state = initialState
		default:
			return state;
	}
}
