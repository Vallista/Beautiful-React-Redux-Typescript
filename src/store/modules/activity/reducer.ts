import {
  ActionType,
  createReducer,
  createAsyncAction
} from 'typesafe-actions'

import { IActivity } from '../../../apis/modules/activity';

export const FETCH_ACTIVITIES = {
  REQUEST: 'FETCH_ACTIVITIES_REQUEST',
  SUCCESS: 'FETCH_ACTIVITIES_SUCCESS',
  FAILURE: 'FETCH_ACTIVITIES_FAILURE'
}

interface IRequest {

}

interface IResponse {
  activities: IActivity[]
}

interface IError {
  message: string
}

export const fetchActivities = createAsyncAction(FETCH_ACTIVITIES.REQUEST, FETCH_ACTIVITIES.SUCCESS, FETCH_ACTIVITIES.FAILURE)<IRequest, IResponse, IError>()

const actions = {
  fetchActivities
}

type Actions = ActionType<typeof actions>
type State = { activities: IActivity[], message: string }

const initialState: State = { activities: [], message: '' }

const reducer = createReducer<State, Actions>(initialState)
  .handleAction(fetchActivities.success, (state, action) => {
    return { ...state, activities: action.payload.activities }
  })
  .handleAction(fetchActivities.failure, (state, action) => {
    return { ...state, message: action.payload.message }
  })
  .handleAction(fetchActivities.request, (state) => {
    return { ...state }
  })

export default reducer