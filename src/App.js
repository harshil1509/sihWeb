import './App.css';
import Main from './Main.js'
import ResponsiveAppBar from './Navbar';

function App() {
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
