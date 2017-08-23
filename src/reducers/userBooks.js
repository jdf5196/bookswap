const initialState = [];

export default (state=initialState, action)=>{
	switch(action.type){
		case 'USER_BOOKS':
			if (action.payload.length < 1 || action.payload == undefined){
				return initialState
				break;
			}else{
				return state = action.payload
			}
		case 'ADD_BOOK':
			return[
				...state, action.payload
			]
		case 'BOOK_DELETED':
			return[
				...state.slice(0, action.payload),
				...state.slice(action.payload+1)
			]
		case 'CHANGE_USER_TRADE':
			return[
				...state.slice(0, action.payload.index),
				action.payload.book,
				...state.slice(action.payload.index+1)
			]
		default:
			return state;
	}
}
