# 3. Reuse

## Tech Stacks

powered by Create-React-App

1. React
2. Redux
3. Redux saga
4. TypeScript
5. typesafe-actions
6. node-fetch
7. react-redux

## What's Different from [2. Modularization](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/2.modularization)

What's Different from before modularization project?

> If you want to see the whole situation, go [here](https://github.com/Vallista/Beautiful-React-Redux-Typescript/tree/2.modularization).

### src/apis

**modules/activity.ts**

```ts
import fetch from 'node-fetch'
import { IActivity } from '../../store/modules/activity/reducer';

export interface IRequest { }
export interface IError {
  message: string
}

const fetchActivities = (): Promise<IActivity[]> => {
  return fetch('http://fakerestapi.azurewebsites.net/api/Activities')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IActivity[]> // 수정 필요
    })
}

export default {
  fetchActivities
}
```

**modules/employee.ts**

```ts
import fetch from 'node-fetch'
import { IEmployee } from '../../store/modules/employee/reducer'

export interface IRequest { }

export interface IResponse {
  status: string
  data: IEmployee[]
}

export interface IError {
  message: string
}

const fetchEmployees = (): Promise<IResponse> => {
  return fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IResponse>
    })
}

export default {
  fetchEmployees
}
```

What's different from before is that Request, Response, and Error went into the API. Then Employee, Activity was incorporated into the reducer.

The difference between 'employee' and 'activity' is that 'employee' has a return model of the server by default. On the other hand, 'Activity' was developed like this because there was no return model for the server.

### src/store

There is a big change in 'store'. That is, the common module has separated.

**src/store/lib/index.ts**

```ts
import {
  createAsyncAction as asyncActionCreator,
  AsyncActionCreatorBuilder,
  ActionType,
  createReducer
} from 'typesafe-actions'
import { call, put, ForkEffect } from 'redux-saga/effects'

export type AsyncAction = {
  REQUEST: string
  SUCCESS: string
  FAILURE: string
}

export type PromiseCreatorFunction<P, T> = ((payment: P) => Promise<T>) | (() => Promise<T>)

export const createAsyncAction = (actionName: string): AsyncAction => {
  const asyncTypeAction: string[] = ['_REQUEST', '_SUCCESS', '_FAILURE']

  return {
    REQUEST: actionName + asyncTypeAction[0],
    SUCCESS: actionName + asyncTypeAction[1],
    FAILURE: actionName + asyncTypeAction[2]
  }
}

export const createActionEntity = <R, S, F>(asyncAction: AsyncAction) =>
  asyncActionCreator(asyncAction.REQUEST, asyncAction.SUCCESS, asyncAction.FAILURE)<R, S, F>()

export function createAsyncSaga<RequestType, RequestPayload, SuccessType, SuccessPayload, FailureType, FailurePayload>(
  asyncAction: AsyncActionCreatorBuilder<
    [RequestType, [RequestPayload, undefined]],
    [SuccessType, [SuccessPayload, undefined]],
    [FailureType, [FailurePayload, undefined]]
  >,
  asyncFunction: PromiseCreatorFunction<RequestPayload, SuccessPayload>,
  successFunc?: any,
  failureFunc?: any
) {
  return function* saga(action: ReturnType<typeof asyncAction.request>) {
    try {
      const result: SuccessPayload = yield call(asyncFunction, (action as any).payload)
      yield put(asyncAction.success(result))
      if (successFunc) {
        yield call(successFunc, result)
      }
    } catch (err) {
      yield put(asyncAction.failure(err))
      if (failureFunc) {
        yield call(successFunc, err)
      }
    }
  }
}

export function createCustomReducer<S, A extends { [key: string]: any }>(state: S, action: A) {
  type Actions = ActionType<typeof action>
  type States = typeof state

  return createReducer<States, Actions>(state)
}

export const combineSagas = (param: { [key: string]: ForkEffect<never>[] }) => function* () {
  const targetSagas = Object.values(param).flat()

  for (let i = 0; i < targetSagas.length; i++) {
    yield targetSagas[i]
  }
}
```

Common modules help make it easier to use in modules. 

1. 'AsyncAction' is a model that can be used in common for asynchronous communication. 
2. 'PromiseCreatorFunction' is the type that provides the basic model of asynchronous communication.
3. 'createAsyncAction' takes prefix name to make AsyncAction model.
4. 'CreateActivity' uses 'createAsyncAction' from 'typesafe-action' to produce asynchronous actions.
5. 'createAsyncSaga' is a function that makes saga. Because 'redux-saga' uses a generator to detect events, 'createAsyncSaga' takes asynchronous actions and APIs to create a saga generator.
6. 'createCustomReducer' helps make the reducer easier.
7. CombineSagas helps connect saga as previously explained.

**activty/reducer.ts**

```ts
import { createAsyncAction, createActionEntity, createCustomReducer } from '../../lib'
import { IRequest, IError } from '../../../apis/modules/activity'

export interface IActivity {
  ID: number
  Title: string
  DueDate: string
  Completed: boolean
}

const FETCH = createAsyncAction('activity/FETCH')
export const fetch = createActionEntity<IRequest, IActivity[], IError>(FETCH)

const actions = { fetch }
const state = { activities: [] as IActivity[], message: '' }

const reducer = createCustomReducer(
  state,
  actions
)
  .handleAction(fetch.success, (state, action) => {
    return { ...state, activities: action.payload }
  })
  .handleAction(fetch.failure, (state, action) => {
    return { ...state, message: action.payload.message }
  })

export default reducer
```

You can see that the code has decreased significantly by removing the common code. You don't need to make a type anymore because it creates a reducer and creates a status and action type easily inside the 'createCustomReducer'.

**activity/saga.ts**

```ts
import { takeEvery } from 'redux-saga/effects'

import API from '../../../apis/modules/activity'
import { createAsyncSaga } from '../../lib'
import { fetch } from './reducer'

const asyncFetchSaga = createAsyncSaga(fetch, API.fetchActivities)

export default [
  takeEvery(fetch.request, asyncFetchSaga)
]
```

Saga's code has also been greatly reduced. You can see that createAsyncSaga has a complex logic, but it's much easier to use.
