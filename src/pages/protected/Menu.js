import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import Menu from '../../features/pos/menu'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Order"}))
      }, [])


    return(
        < Menu/>
    )
}

export default InternalPage