import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import Shift from '../../features/pos/shift'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "POS"}))
      }, [])


    return(
        < Shift/>
    )
}

export default InternalPage