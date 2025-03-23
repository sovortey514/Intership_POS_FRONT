import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import MembershipList from '../../features/inventorymanagement/membership'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Inventory Management"}))
      }, [])


    return(
        <MembershipList />
    )
}

export default InternalPage