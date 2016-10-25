const initialState = [];

export default (state=initialState, action)=>{
	switch(action.type){
		case 'GET_BOOKS':
			if (action.payload.length < 1 || action.payload == undefined){
				return state
				break;
			}else{
				return state = action.payload
			}
		case 'DELETE_BOOK':
			return[
				...state.slice(0, action.payload),
				...state.slice(action.payload+1)
			]
		case 'CHANGE_TRADE':
			return[
				...state.slice(0, action.payload.index),
				action.payload.book,
				...state.slice(action.payload.index+1)
			]
		default:
			return state;
	}
}