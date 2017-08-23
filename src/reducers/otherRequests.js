const initialState = {
	open: false
};

export default (state=initialState, action)=>{
	switch(action.type){
		case 'OTHER_REQUESTS_OPEN':
			return state = action.payload
		case 'OTHER_REQUESTS_CLOSE':
			return state = action.payload
		default:
			return state;
	}
}
