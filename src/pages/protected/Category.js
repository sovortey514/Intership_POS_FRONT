import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import Category from '../../features/inventorymanagement/Category'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Order"}))
      }, [])


    return(
        < Category/>
    )
}

export default InternalPage