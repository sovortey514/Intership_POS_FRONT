import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import Suppliers from '../../features/inventorymanagement/Suppliers'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Inventory Management"}))
      }, [])


    return(
        < Suppliers/>
    )
}

export default InternalPage