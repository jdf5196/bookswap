const initialState = {
	open: false
};

export default (state=initialState, action)=>{
	switch(action.type){
		case 'LOCATION_OPEN':
			document.querySelector('body').classList.add('modal-open');
			document.querySelector('html').classList.add('modal-open');
			return state = action.payload
		case 'LOCATION_CLOSE':
			document.querySelector('body').classList.remove('modal-open');
			document.querySelector('html').classList.remove('modal-open');
			return state = initialState
		default:
			return state;
	}
}
