import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import Report from '../../features/inventorymanagement/Report'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Inventory Management"}))
      }, [])


    return(
        < Report/>
    )
}

export default InternalPage