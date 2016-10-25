export default (state=null, action)=>{
	switch(action.type){
		case 'SELECT_BOOK':
			return state = action.payload
		default:
			return state;
	}
}