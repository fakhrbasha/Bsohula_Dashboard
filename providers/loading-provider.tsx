import Loading from '@/app/(Dashboard)/loading'
import React from 'react'

const LoadingProvider = ({flag , children , className} : {flag:boolean , children:React.ReactNode , className?:string}) => {
    return (
        <div className={className}>
            {flag ? <Loading/>: children }
        </div>
    )
}

export default LoadingProvider
