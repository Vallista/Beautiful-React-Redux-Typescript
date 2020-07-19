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