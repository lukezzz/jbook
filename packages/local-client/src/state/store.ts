import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { ActionType } from './action-types'

export const store = createStore(reducers, {}, applyMiddleware(thunk))

// const state = store.getState()

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        cellType: 'code'
    }
})
store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        cellType: 'text'
    }
})

let id = store.getState().cells?.order[0]

if (id) {
    store.dispatch({
        type: ActionType.UPDATE_CELL,
        payload: {
            id: id,
            content: 'console.log("test")'
        }
    })
} else {
    store.dispatch({
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id: null,
            cellType: 'code'
        }
    })
}
id = store.getState().cells?.order[1]

if (id) {
    store.dispatch({
        type: ActionType.UPDATE_CELL,
        payload: {
            id: id,
            content: 'console.log("test")'
        }
    })
}

console.log(store.getState())