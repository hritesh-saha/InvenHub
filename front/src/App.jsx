import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Update } from './pages/Update';
import { User } from './pages/User';
import {Otp} from './pages/Otp';
import { Signout } from './components/Signout';
import { Predict } from './pages/Predict';
import AI from './pages/AI';
import SearchPage from './pages/SearchPage';


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/signin' element={<Signin/>}></Route>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
      <Route path='/products' element={<Products/>}></Route>
      <Route path='/inventory' element={<Inventory/>}></Route>
      <Route path='/update' element={<Update/>}></Route>
      <Route path='/user' element={<User/>}></Route>
      <Route path='/otp' element={<Otp></Otp>}></Route>
      <Route path='/predict' element={<Predict></Predict>}></Route>
      <Route path='/ai' element={<AI></AI>}></Route>
      <Route path='/search' element={<SearchPage/>}></Route>




    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
