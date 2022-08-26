import './App.css';
import Main from './Main.js'
import ResponsiveAppBar from './Navbar';
import React, { useState, useEffect } from 'react';

function App() {
  useEffect(() => {
    if(localStorage.getItem('idx')){
      localStorage.removeItem('idx')
    }
  }, [])
  return (
    <div className="App">
     {/* <h1>🤗 SIH 2022 ANTON 🤗</h1> */}
     <ResponsiveAppBar />
     <div>
     <Main/>
     </div>
    </div>
  );
}

export default App;
