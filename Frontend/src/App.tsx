import { BrowserRouter,Route, Routes } from 'react-router-dom'
import  Login from './Pages/Login/Login'
import Profile from './Pages/Profile/Profile'
import PublicRoute from './Routes/PublicRoute'
import ProtectedRoute from './Routes/ProtectedRoute'
import NotFound from './Pages/NotFound/NotFound'
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

        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>

  )

}

export default App
