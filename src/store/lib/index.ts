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