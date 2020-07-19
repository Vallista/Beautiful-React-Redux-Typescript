# 2. Modularization

## Tech Stacks

powered by Create-React-App

1. React
2. Redux
3. Redux saga
4. TypeScript
5. typesafe-actions
6. node-fetch
7. react-redux

## What's Different from [1. Standard](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/1.standard)

What's Different from before standard project?

> If you want to see the whole situation, go [here](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/1.standard).

### src/apis

**modules/activity.ts**

```ts
import fetch from 'node-fetch'

export interface IActivity {
  ID: number
  Title: string
  DueDate: string
  Completed: boolean
}

export const fetchActivities = (): Promise<IActivity> => {
  return fetch('http://fakerestapi.azurewebsites.net/api/Activities')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IActivity>
    })
}

```

An API to import activity has been added. So I will call two APIs.

### src/store

There are many changes to the store. **The important thing is modularity**.

**Module Structure**

![2](https://github.com/Vallista/Beautiful-React-Redux-Typescript/blob/2.separation/screenshots/1.png?raw=true)

Module consists of index.ts, reducer.ts, and saga.ts. After registering reducers and saga in index.ts, we will make a structure that applies to redsux without having to control it.

Let's look at examples based on activity modules.

**activty/reducer.ts**

```ts
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
```

**activity/saga.ts**

```ts
import { takeEvery, call, put } from 'redux-saga/effects'

import { fetchActivities } from '../../../apis/modules/activity'
import { FETCH_ACTIVITIES } from './reducer'

function* fetch() {
  try {
    const activities = yield call(fetchActivities)
    yield put({ type: FETCH_ACTIVITIES.SUCCESS, payload: { activities: activities } })
  } catch (e) {
    yield put({ type: FETCH_ACTIVITIES.FAILURE, payload: { message: e.message } })
  }
}

export default [
  takeEvery(FETCH_ACTIVITIES.REQUEST, fetch)
]
```

The reducers and saga are no different from existing modules.

**activity/index.ts**

```ts
import reducer from './reducer'
import saga from './saga'

import * as actions from './reducer'

export default {
  reducer,
  saga,
  actions
}
```

index.ts combines reducers and saga, and registers actions for external use. Let's see how you convert these modules to rootReducher and rootSagas.

**modules/index.ts**

```tsx
import { combineReducers } from 'redux'
import { ForkEffect } from 'redux-saga/effects'

import employee from './employee'
import activity from './activity'

const combineSagas = (param: { [key: string]: ForkEffect<never>[] }) => function* () {
  const targetSagas = Object.values(param).flat()

  for (let i = 0; i < targetSagas.length; i++) {
    yield targetSagas[i]
  }
}

export default {
  rootReducer: combineReducers({ employee: employee.reducer, activity: activity.reducer }),
  rootSagas: combineSagas({ activity: activity.saga, employee: employee.saga })
}
```

Modules/index.ts serves to combine multiple modules. This connection allows you to resolve the redux at the module level without having to change its settings.

The important part here is the computerSagas, which is similar to the computer. As you can see from the code above, saga.ts is delivering saga in array form. If you do this, saga can easily watch the event.

### src/pages

**home.tsx**

```tsx
import React, { useEffect } from 'react'

import useEmployee from '../../hooks/useEmployee'
import useActivity from '../../hooks/useActivity'

import Employee from '../../components/Employee'
import Activity from '../../components/Activity'

const Home: React.FC = () => {
  const { employeeState, fetchEmployees } = useEmployee()
  const { activities, fetchActivities } = useActivity()

  useEffect(() => {
    fetchEmployees()
    fetchActivities()
  }, [])

  return <div>
    Home!
    {employeeState.map((employee, index) => <Employee {...employee} key={index} />)}
    <hr />
    {activities.map((activity, index) => <Activity {...activity} key={index} />)}
  </div>
}

export default Home
```

Likewise, hooks add useActivity like useEmployee and register the fetch event with useEffect.
