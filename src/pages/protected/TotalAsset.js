import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TotalAsset from '../../features/assetmanagement/totalasset'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Asset"}))
      }, [])


    return(
        <TotalAsset />
    )
}

export default InternalPage