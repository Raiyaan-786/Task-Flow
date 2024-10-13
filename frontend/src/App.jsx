import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ColorModeContext, useMode, } from './theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Sidebar from './pages/global/Sidebar'
import Topbar from './pages/global/Topbar'
import Signup from './pages/authentication/Signup'
import Login from './pages/authentication/Login'
import PrivateRoute from './pages/authentication/PrivateRoute'
import PrivateLayout from './layout/PrivateLayout'

import Tasks from './pages/tasks'
import Users from './pages/users'
import Invoices from './pages/invoices';
import Userform from './pages/userform';
import Taskform from './pages/taskform';
import Taskpage from './pages/taskpage';
import Dashboard from './pages/dashboard';
import BackendData from './pages/backenddata';


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
              <Route path='/users' element={<PrivateRoute><Users/></PrivateRoute>}/>
              <Route path='/invoices' element={<PrivateRoute><Invoices/></PrivateRoute>}/>
              <Route path='/tasks' element={<PrivateRoute><Tasks/></PrivateRoute>}/>
              <Route path='/userform' element={<PrivateRoute><Userform/></PrivateRoute>}/>
              <Route path='/taskform' element={<PrivateRoute><Taskform/></PrivateRoute>}/>
              <Route path='/backenddata' element={<PrivateRoute><BackendData/></PrivateRoute>}/>
              <Route path='/tasks/taskpage/:taskid' element={<PrivateRoute><Taskpage/></PrivateRoute>}/>
            </Route>
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
