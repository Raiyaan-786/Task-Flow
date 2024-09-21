import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Task from './pages/Task'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/task' element={<Task/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
