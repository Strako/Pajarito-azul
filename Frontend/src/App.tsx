import { BrowserRouter,Route, Routes } from 'react-router-dom'
import  Login from './Pages/Login'
import Profile from './Pages/Profile'
import PublicRoute from './Routes/PublicRoute'
import ProtectedRoute from './Routes/ProtectedRoute'
import './App.css'

function App() {

  return(

    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />} >
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute/>} >
          <Route path="/profile" element={<Profile/>} />
        </Route>

        <Route path="*" element={<Login />} />


      </Routes>
    </BrowserRouter>

  )

}

export default App
