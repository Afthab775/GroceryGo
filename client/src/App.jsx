import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Adminroutes from './modules/admin/aroutes/Adminroutes'
import Userroutes from './modules/user/uroutes/Userroutes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/admin/*' element={<Adminroutes/>}/>
          <Route path='/*' element={<Userroutes/>}/>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
