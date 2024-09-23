import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Taskpage from './pages/Taskpage'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Signup />} />
          <Route path='/tasks' element={<Tasks/>}/>
          <Route path='/taskpage' element={<Taskpage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
