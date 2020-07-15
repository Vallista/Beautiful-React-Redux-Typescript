# 1. Standard

## Tech Stacks

powered by Create-React-App

1. React
2. Redux
3. Redux saga
4. TypeScript
5. typesafe-actions
6. node-fetch
7. react-redux

## Describes

The project demonstrates how to apply React and Redux, Redux-saga, and TypeScript with simple actions to receive and output the deployee data.

### src/apis

**modules/employee.ts**

```ts
import fetch from 'node-fetch'

export interface IEmployee {
  id: string
  employee_name: string
  employee_salary: string
  employee_age: string
  profile_image: string
}

export const fetchEmployees = (): Promise<IEmployee> => {
  return fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IEmployee>
    })
}
```

The API contains code for asynchronous communication. For example, the example above is the code that calls up Employeees from the server.

### src/store

Store with Redux. Create and manage status and actions.

**reducers.ts**

```ts
import {
  ActionType,
  createReducer,
  createAsyncAction
} from 'typesafe-actions'
import { IEmployee } from '../apis/modules/employee';

const FETCH_EMPLOYEES = {
  REQUEST: 'EMPLOYEES_FETCH_REQUEST',
  SUCCESS: 'EMPLOYEES_FETCH_SUCCESS',
  FAILURE: 'EMPLOYEES_FETCH_FAILURE'
}

interface IRequest {

}

interface IResponse {
  employees: IEmployee[]
}

interface IError {
  message: string
}

export const fetchEmployees =
  createAsyncAction(FETCH_EMPLOYEES.REQUEST, FETCH_EMPLOYEES.SUCCESS, FETCH_EMPLOYEES.FAILURE)<IRequest, IResponse, IError>()

const actions = {
  fetchEmployees
}

type Actions = ActionType<typeof actions>
type State = { employees: IEmployee[], message: string }

const initialState: State = { employees: [], message: '' }

const reducer = createReducer<State, Actions>(initialState)
  .handleAction(fetchEmployees.success, (state, action) => {
    return { ...state, employees: action.payload.employees }
  })
  .handleAction(fetchEmployees.failure, (state, action) => {
    return { ...state, message: action.payload.message }
  })
  .handleAction(fetchEmployees.request, (state) => {
    return { ...state }
  })

export default reducer
```

Reducer has a logic that changes the current state to a new state. Reducer is the one that executes the action and changes the internal state. To create this reductor, action and logic to generate status are included together.

In the example, typesafe-action was used. typesafe-action is a module that makes it more convenient to use when generating action in type scripts.

When you create an asynchronous action, you must have three states: Request, Success, and Failure. That's why FETCH_EMPLOYES has REQUEST, SUCCESS, and FAILURE.

Each of these three names is held because you need to set a unique name so that you can recognize what events are coming from the reducers and saga.

**sagas.ts**

```ts
import { takeEvery, call, put } from 'redux-saga/effects'

import { fetchEmployees } from '../apis/modules/employee'

function* fetch() {
  try {
    const employees = yield call(fetchEmployees)
    yield put({ type: 'EMPLOYEES_FETCH_SUCCESS', payload: { employees: employees.data } })
  } catch (e) {
    yield put({ type: 'EMPLOYEES_FETCH_FAILURE', payload: { message: e.message } })
  }
}

export default function* sagas() {
  yield takeEvery("EMPLOYEES_FETCH_REQUEST", fetch)
}
```
Saga brings and uses functions created by API.

Bring the one that set the EMPLOYEES_FETCH_SUCCESS here and use it.

1. Continuously monitors 'EMPLOYEES_FETCH_REQUEST' with takeEvery.
2. When 'EMPLOYEES_FETCH_REQUEST' is called by dispatch, the fetch generator is started.
3.Fetch runs and invokes the fetchEmployes function to communicate API.
4. After communication, check success and failure and pass on the value.
5. Run 'EMPLOYEES_FETCH_SUCCESS' or 'EMPLOYEES_FETCH_FAILURE'.

**index.ts**

```ts
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import sagas from './sagas'
import reducers from './reducers'

const sagaMiddleware = createSagaMiddleware()

export type RootState = ReturnType<typeof reducers>

const store = createStore(reducers, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(sagas)

export default store

```

`index.ts` sets the store and executes saga middleware.

### src/hooks

**useEmployee.tsx**

```tsx
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/reducers'
import { RootState } from '../../store'

function useEmployee() {
  const dispatch = useDispatch()
  const employeeState = useSelector((store: RootState) => store.employees)

  const fetchEmployees = () => {
    dispatch(actions.fetchEmployees.request(''))
  }

  return {
    employeeState,
    fetchEmployees
  }
}

export default useEmployee
```

`react-redux` makes it easy to implement in hooks for easy binding of react and redux. These hooks are called `controllers-views` in Flux.

Use Selector and Dispatch to request actions and status in real time or to receive changed results. It returns its status and action as a return value.

### src/pages

**home.tsx**

```tsx
import React, { useEffect } from 'react'

import useEmployee from '../../hooks/useEmployee'

import Employee from '../../components/Employee'

const Home: React.FC = () => {
  const { employeeState, fetchEmployees } = useEmployee()

  useEffect(() => {
    fetchEmployees()
  }, [])

  return <div>
    Home!
    {employeeState.map((employee, index) => <Employee {...employee} key={index} />)}
  </div>
}

export default Home
```

Take the value of 'useEmployee' to custom hooks and sprinkle it. Then, `fetchEmployee` is performed for the first time with useEffect.
