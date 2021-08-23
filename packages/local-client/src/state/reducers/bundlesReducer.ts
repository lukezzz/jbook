import { ActionType } from "../action-types";
import { Action } from "../actions";
import produce from 'immer'

interface BoundlesState {
    [key: string]: {
        loading: boolean
        code: string
        err: string
    } | undefined
}

const initialState: BoundlesState = {}

const reducer = (state: BoundlesState = initialState, action: Action): BoundlesState => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ActionType.BUNDLE_START:
                draft[action.payload.cellId] = {
                    loading: true,
                    code: '',
                    err: ''
                }
                return draft
            case ActionType.BUNDLE_COMPLETE:
                draft[action.payload.cellId] = {
                    loading: false,
                    code: action.payload.bundle.code,
                    err: action.payload.bundle.err
                }
                return draft

            default:
                return draft
        }
    })
}

export default reducer