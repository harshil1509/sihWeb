import React, {useState} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalOpener({open=false, setOpen, data, columns}) {

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if(data && data.length!=0){

            let arr = Object.keys(data[0])
            let temp = []
        
            arr.map(i=>{
                let obj = {}
                obj['id'] = i
                obj['label'] = i
                temp.push(obj)
            })
            columns = temp
    }


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
          <div style={{display:"flex", justifyContent: "space-between "}}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Top 10 matching entries
            </Typography>
            <Button onClick={handleClose} >
                Close
            </Button>
            </div>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .map((row,index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.number}>
                      {columns.map((column) => {
                        let value = row[column.id];
                       if(column.id == 'Percentange Match %'){
                        value = value.toFixed(2) +" " +  "%"
                       }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>
              {/* {data.map(i=>{
                return(
                    <h3>{i['Name']}</h3>
                )
              })} */}
              {/* <CreateTable cols={col} rows={data} loading={false} file={"wmks"} forModal={true}/> */}
           
            </Typography>
           
          </Box>
        </Fade>
        
      </Modal>
    </div>
  );
}
