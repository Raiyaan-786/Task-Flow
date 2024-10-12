import React from 'react'
import Sidebar from '../pages/global/Sidebar'
import Topbar from '../pages/global/Topbar'
import { Outlet } from 'react-router-dom'

const PrivateLayout = ({isCollapsed,setIsCollapsed}) => {
  return (
    <div className='app'>
       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/> 
       <main className='content'>
        <Topbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
        <Outlet/>
       </main>
    </div>
  )
}

export default PrivateLayout