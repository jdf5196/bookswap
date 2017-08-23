const initialState = [];

export default (state=initialState, action)=>{
	switch(action.type){
		case 'TRADES':
			if (action.payload.length < 1 || action.payload == undefined){
				return initialState
				break;
			}else{
				return state = action.payload
			}
		case 'REMOVE_TRADE':
			return{books: [...state.books.slice(0, action.payload), ...state.books.slice(action.payload+1)]}
		default:
			return state;
	}
}
