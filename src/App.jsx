// import './App.css'
// //AIzaSyBu2K_ZHnwa2w4QeSYXSEbAAQ2o_MLQX08
// import TimeComplexity from './Components/TimeComplexity';
// import ComplexityGraph from './Components/ChartPage';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// export default function App() {
//   const data =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<TimeComplexity></TimeComplexity>} />
//         <Route path="/chart" element={<ComplexityGraph timeComplexity="O(n^3)" value={data}></ComplexityGraph>} />
//       </Routes>
//     </Router>
//   );
// }
import './App.css'
import React from 'react';
import Signup from './Components/Authentication/Signup';
import Login from './Components/Authentication/Login';
import ChartPage from './Components/ChartPage';
import HomePage from './Components/Pages/HomePage';
import TimeComplexity from './Components/TimeComplexity';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
export default function App(){
  return(
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/analysis' element={<TimeComplexity/>}></Route>
        <Route path ='/signup' element={<Signup/>}></Route>
        <Route path ='/login' element={<Login/>}></Route>
        <Route path='/chart' element={<ChartPage timeComplexity={"O(n^2)"}/>}></Route>
      </Routes>
    </Router>
  )
}
