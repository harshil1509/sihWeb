import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../src/assessts/logo.jpg';
import rural from '../src/assessts/rural.jpg';
export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" style={{ background: 'black' }}>
        <Toolbar>
          <img src={logo} style={{width: 350, height: 150}}/>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginLeft: 450}} >
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }} style={{fontFamily:"Coolvetica", color:"#fff"}}>
            ANTON
          </Typography>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }} style={{color:"#fff"}}>
            SH1009
          </Typography>
          </div>
          <img src={rural} style={{width: 350, height: 150, marginLeft: 400}}/>

        </Toolbar>
      </AppBar>
    </Box>
  );
}
