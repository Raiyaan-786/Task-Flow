import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ColorModeContext, useMode, } from './theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Sidebar from './pages/global/Sidebar'
import Topbar from './pages/global/Topbar'
import Tasks from './pages/tasks'
import Users from './pages/users'
import Invoices from './pages/invoices';
import Userform from './pages/userform';
import Taskform from './pages/taskform';
import Taskpage from './pages/taskpage';
import Dashboard from './pages/dashboard';


function App() {
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <div className='app'>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <main className='content'>
              <Topbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
              <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/users' element={<Users/>}/>
                <Route path='/invoices' element={<Invoices/>}/>
                <Route path='/tasks' element={<Tasks/>}/>
                <Route path='/userform' element={<Userform/>}/>
                <Route path='/taskform' element={<Taskform/>}/>
                <Route path='/tasks/taskpage/:taskid' element={<Taskpage/>}/>
              </Routes>
            </main>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
