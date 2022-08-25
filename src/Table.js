import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import ModalOpener from './Modal'




// const columns = [
//   { id: 'number', label: 'S. No', minWidth: 170 },

//   // { id: 'Name', label: 'Name', minWidth: 170 },
//   // { id: "father’s name", label: "Father's Name", minWidth: 100 },
//   // {
//   //   id: 'DOB',
//   //   label: 'DOB',
//   //   minWidth: 170,
//   //   align: 'right',
//   // },
//   // {
//   //   id: 'Address',
//   //   label: 'Address',
//   //   minWidth: 170,
//   //   align: 'right',
//   // },

// ];

function createData(name, fatherName, dob, address) {
  return { name, fatherName, dob, address };
}

const rows = [
    // createData('India', 'InnmmnnmN', 1324171354, 3287263),
    // createData('China', 'CN', 1403500365, 9596961),
    // createData('Italy', 'IT', 60483973, 301340),
    // createData('United States', 'US', 327167434, 9833520),
    // createData('Canada', 'CA', 37602103, 9984670),
    // createData('Australia', 'AU', 25475400, 7692024),
    // createData('Germany', 'DE', 83019200, 357578),
    // createData('Ireland', 'IE', 4857000, 70273),
    // createData('Mexico', 'MX', 126577691, 1972550),
    // createData('Japan', 'JP', 126317000, 377973),
    // createData('France', 'FR', 67022000, 640679),
    // createData('United Kingdom', 'GB', 67545757, 242495),
    // createData('Russia', 'RU', 146793744, 17098246),
    // createData('Nigeria', 'NG', 200962417, 923768),
    // createData('Brazil', 'BR', 210147125, 8515767),
];




function CreateTable({cols,rows, loading, file}) {
   
    // rows.map(row=>{
    //     row['number'] = rows.ind
    // })
  const columns = cols
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [resData, setResData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open, setIsOpen] = useState(false)

  const makeApiCall =async (idx)=>{
    const url2 = `http://localhost:8000/backend/fetch-results/?idx=${idx-1}`

    setIsLoading(true)
    console.log(idx, url2)

    try {
      const res = await axios.get(url2);
      console.log(res.data.data)
      setResData(res.data.data)
      setIsLoading(false)
      setIsOpen(true)

    } catch (error) {
      console.error(error);
    }
  }

 
  return (
    <div>
    
    
      <ModalOpener open={open} setOpen={setIsOpen} data={resData} columns={cols}/>
  
    {file!="" && !loading ? <div>
   
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.number} onClick={()=>makeApiCall(row.number)}>
                      {columns.map((column) => {
                        let value = row[column.id];
                        
                        {/* console.log(column.id, value, row) */}
                        if(!value){
                          value = row["father's name"]
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div> : null}
     
   
    </div>
  )
}

export default CreateTable