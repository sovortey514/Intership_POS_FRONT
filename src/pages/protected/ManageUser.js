import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ToatalUser from '../../features/usermanagement'


function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Asset"}))
      }, [])

    return(
        < ToatalUser/>
    )
}

export default InternalPage