export default (state=null, action)=>{
	switch(action.type){
		case 'GET_USER':
			return state = action.payload
		default:
			return state;
	}
}
