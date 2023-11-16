import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoute from './Routes/PublicRoute'
import ProtectedRoute from './Routes/ProtectedRoute'
import NotFound from './Pages/NotFound/NotFound'
import Login from './Pages/Login/Login'
import Profile from './Pages/Profile/Profile'
import Register from './Pages/Register/Register'
import SingleTweet from './Pages/SingleTweet/SingleTweet'
import SingleUser from './Pages/SingleUser/SingleUser'
import Search from './Pages/Search/Search'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />} >
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />} >

          <Route path="/profile" element={<Profile />} />
          <Route path="/single-tweet/:tweetid" element={<SingleTweet/>}/>
          <Route path="/user/:username" element={<SingleUser/>}/>
          <Route path="/search" element={<Search/>}/>
          


        </Route>

        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>


  )

}

export default App
