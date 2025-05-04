import React from 'react'
import TenantSidebar from '../pages/tenant/TenantSidebar'
// import Topbar from '../pages/global/Topbar'
import { Outlet } from 'react-router-dom'

const TenantLayout = ({isCollapsed,setIsCollapsed}) => {
  return (
    <div className='app'>
       <TenantSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/> 
       <main className='content'>
        {/* <TenantTopbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/> */}
        <Outlet/>
       </main>
    </div>
  )
}

export default TenantLayout