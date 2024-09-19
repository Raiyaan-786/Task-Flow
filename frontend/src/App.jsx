import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Login/> */}
      {/* <Signup/> */}
      <Navbar/>
      <Admin/>
    </div>
  )
}

export default App
