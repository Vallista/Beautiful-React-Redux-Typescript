import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store';

import Activity from '../../store/modules/activity'

function useActivity() {
  const dispatch = useDispatch()
  const activities = useSelector((store: RootState) => store.activity.activities)

  const fetchActivities = () => {
    dispatch(Activity.actions.fetch.request(''))
  }

  return {
    activities,
    fetchActivities
  }
}

export default useActivity