import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'


import HistoryCount from '../../features/assetmanagement/historyasset'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Asset"}))
      }, [])


    return(
        < HistoryCount/>
    )
}

export default InternalPage