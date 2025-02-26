import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import PurchaseOrder from '../../features/inventorymanagement/Purchaseorder'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Inventory Management"}))
      }, [])


    return(
        < PurchaseOrder/>
    )
}

export default InternalPage