const initialState = {
	open: false,
	books: []
};

export default (state=initialState, action)=>{
	switch(action.type){
		case 'OPEN_MODAL':
			document.querySelector('body').classList.add('modal-open');
			document.querySelector('html').classList.add('modal-open');
			return state = action.payload
		case 'CLOSE_MODAL':
			document.querySelector('body').classList.remove('modal-open');
			document.querySelector('html').classList.remove('modal-open');
			return state = action.payload
		default:
			return state;
	}
}
