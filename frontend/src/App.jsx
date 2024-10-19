import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ColorModeContext, useMode, } from './theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Signup from './pages/authentication/Signup'
import Login from './pages/authentication/Login'
import PrivateRoute from './pages/authentication/PrivateRoute'
import PrivateLayout from './layout/PrivateLayout'


import Invoices from './pages/invoices';
import Dashboard from './pages/dashboard';
import BackendData from './pages/backenddata';
import ConsultantManager from './pages/consultantmanager';
import CustomerManager from './pages/customermanager';
import Employee from './pages/employee';
import WorkManager from './pages/workmanager';
import Report from './pages/report';
import FileManager from './pages/filemanager';
import UsefulLinks from './pages/usefullinks';


function App() {
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            {/* Public routes */}
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            {/* Private routes only accessed after successful login */}
            <Route element={<PrivateRoute><PrivateLayout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/></PrivateRoute>} >
              <Route path='/' element={ <PrivateRoute><Dashboard/></PrivateRoute>}/>
              <Route path='/workmanager' element={ <PrivateRoute><WorkManager/></PrivateRoute>}/>
              <Route path='/customermanager' element={ <PrivateRoute><CustomerManager/></PrivateRoute>}/>
              <Route path='/consultantmanager' element={ <PrivateRoute><ConsultantManager/></PrivateRoute>}/>
              <Route path='/employee' element={ <PrivateRoute><Employee/></PrivateRoute>}/>
              <Route path='/invoices' element={<PrivateRoute><Invoices/></PrivateRoute>}/>
              <Route path='/report' element={<PrivateRoute><Report/></PrivateRoute>}/>
              <Route path='/filemanager' element={<PrivateRoute><FileManager/></PrivateRoute>}/>
              <Route path='/usefullinks' element={<PrivateRoute><UsefulLinks/></PrivateRoute>}/>
              <Route path='/backenddata' element={<PrivateRoute><BackendData/></PrivateRoute>}/>
            </Route>
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
