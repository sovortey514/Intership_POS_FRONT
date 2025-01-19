import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import AssetCount from '../../features/assetmanagement/assetcount'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Asset"}))
      }, [])


    return(
        < AssetCount/>
    )
}

export default InternalPage