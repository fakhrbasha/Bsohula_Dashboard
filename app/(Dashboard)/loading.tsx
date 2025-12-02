import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'><Loader size={32} className='animate-spin'/></div>
  )
}

export default Loading
