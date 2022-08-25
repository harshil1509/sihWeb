import React, { useState } from "react";
import Papa from "papaparse";
import CreateTable from './Table'
import axios from 'axios';
import SearchBar from "material-ui-search-bar";
import Lottie from 'react-lottie';
import Button from '@mui/material/Button';
import * as animationData from './assessts/loader1.json'
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './MainStyle.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// Allowed extensions for input file
const allowedExtensions = ["csv"];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const formData = new FormData();

function Main() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false);
  const notify = () => toast.success('ENTRY ADDED SUCCESSFULLY !!', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const [rows, setRows] = React.useState([]);
  const [filteredRow, setFilteredRow] = useState([])
  const [cols1, setCols1] = useState([])
  const [cols2, setCols2] = useState([])
  let tempRows = []
  const [rows2, setRows2] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);

  const makeApiCall = async () => {

    const url = "http://localhost:8000/backend/upload-csv/"
    try {
      const res = await axios.post(url, formData);
      // console.log(res)
    } catch (error) {
      console.error(error);
    }

  }


  const [error, setError] = useState("");

  const [file, setFile] = useState("");
  const [file2, setFile2] = useState("")


  function handleFileChange(e, val) {

    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      if (val == 1) {

        setFile(inputFile);
      }
      else {
        setFile2(inputFile)
      }

      if (val == 1) {
        formData.append("csv1", inputFile);
        setLoading(true)
      } else {
        formData.append("csv2", inputFile);

        makeApiCall()
        setLoading2(true)
      }
      handleParse(inputFile, val)
    }

  };

  const [colNames, setColNames] = useState([])
  const [mapping, setMapping] = useState({})
  let forwardMap = {}

  const handleParse = (inpFile, val) => {
    // If user clicks the parse button without
    // a file we show a error
    if (!inpFile) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      let letTemp = []
      letTemp.push({ id: 'number', label: 'S. No', minWidth: 170 })
      setColNames(csv.meta.fields)

      csv.meta.fields.map(i => {
        let newStr = ""

        if (i.includes(" ")) {
          newStr = i.split(" ").join("")
          newStr = i.replace(/[^a-zA-Z0-9 ]/g, '')
        }
        else if (i == "") {
          newStr = "Unnamed"
        }
        else {
          newStr = i
        }
        forwardMap[i] = newStr
      })


      setMapping(forwardMap)

      csv.meta.fields.map(col => {
        if (col != "") {
          let obj = {}
          obj["id"] = col
          obj["label"] = col
          letTemp.push(obj)

        }
      })

      if (val == 1) {

        setCols1(letTemp)
      }
      else {
        setCols2(letTemp)
      }
      const parsedData = csv?.data;
      if (val === 1) {

        setRows(parsedData);
        tempRows = parsedData
        tempRows.map(row => {
          row['number'] = tempRows.indexOf(row) + 1
        })
        setRows(tempRows)
      }
      else {
        setRows2(parsedData);
        tempRows = parsedData
        tempRows.map(row => {
          row['number'] = tempRows.indexOf(row) + 1
        })
        setRows2(tempRows)
      }
      // console.log(parsedData[0]['Name']);
      //map parsedData and createData function to create rows

      // parsedData.map(row => {
      //   // console.log(row['Name'], row["father's name"], row['DOB'], row['Address'])
      //   const obj = createData(row['Name'], row["father's name"], row['DOB'], row['Address'])
      //   // rows.push(obj)
      //   setRows(rows => [...rows, obj])
      // })
      if (val == 1) {

        setLoading(false)
      } else {
        setLoading2(false)
      }
    };
    reader.readAsText(inpFile);
  };


  const [searchedVal, setSearchedVal] = useState("")

  const requestSearch = (searchedVal) => {
    setSearchedVal(searchedVal)
    console.log(rows.length)
    const idx = parseInt(searchedVal)
    console.log(idx)
    if (rows?.[idx - 1]) {
      let newArr = []
      newArr.push(rows[idx - 1])
      setFilteredRow(newArr)
    } else {
      setFilteredRow([])
    }
  };



  const onSubmit = async (data) => {
    let newObj = {}
    Object.keys(mapping).map(i => {
      if (i == "") {
        console.log("yes")
        newObj[""] = rows.length + 1
      } else {

        newObj[i] = data[mapping[i]]
      }
      
    })

    // make api call and update backend
    const url = "http://127.0.0.1:8000/backend/update-csv/"
    try {
      const res = await axios.post(url, { entry: newObj })
      console.log(res)
    } catch (error) {
      console.log(error)
    }

    //now update rows
    newObj['number'] = rows.length + 1
    console.log(data, newObj);
    setRows(curr => [...curr, newObj])
    notify()
    setOpen(false)
  }



  const cancelSearch = () => {
    console.log('called')
    setSearchedVal("");
    requestSearch(searchedVal);
  };

  return (
    <div className="container">
      <div className="left-half">
        <label htmlFor="csvInput" style={{ display: "block", fontFamily: "Comfortaa", fontSize: 36 }}>
          Enter CSV File 1
        </label>

        <input
          onChange={(event) => handleFileChange(event, 1)}
          id="csvInput"
          name="file"
          type="File"
          className="inputfile"
        />
        {loading ? <div>
          <Lottie options={defaultOptions}
            height={260}
            width={260}
          />
        </div> : null}

        {!loading && file != "" && (
          <>
            <div style={{ marginTop: 20 }}>
              <SearchBar
                value={searchedVal}
                onChange={(searchVal) => requestSearch(searchVal)}
                cancelSearch={cancelSearch}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <CreateTable cols={cols1} rows={filteredRow.length != 0 & searchedVal != "" ? filteredRow : rows} loading={loading} file={file} />
            </div>
          </>
        )}
      </div>

      <div className="right-half">
        <label htmlFor="csvInput" style={{ display: "block", fontFamily: "Comfortaa", fontSize: 36, color: "#fff" }}>
          Enter CSV File 2
        </label>
        <input
          onChange={(event) => handleFileChange(event, 2)}
          id="csvInput2"
          name="file"
          type="File"
          className="inputfileNew"
        />
        {loading2 ? <div>
          <Lottie options={defaultOptions}
            height={250}
            width={250}
          />
        </div> : null}

        {!loading2 && file2 != "" && (
          <>
            <div style={{ marginTop: 85 }}>

              <CreateTable cols={cols2} rows={rows2} loading={loading} file={file} />
            </div>
            <div style={{ position: "absolute", marginTop: -650, marginLeft: -230 }}>
              <Button variant="contained" style={{
                borderRadius: 35,
                backgroundColor: "blue",
                padding: "18px 36px",
                fontSize: "12px",
                color:"#fff"
              }} onClick={() => setOpen(true)}>Add Custom Entry</Button>
            </div>
          </>

        )}
      </div>

      {open ? (
        <Modal
          keepMounted
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
          <h2>Please fill in the details below</h2>


            <form onSubmit={handleSubmit(onSubmit)}>
              {
                Object.keys(mapping).map(i => {
                  return (
                    <div>
                    {mapping[i] != 'Unnamed' ?
                    (
                      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop: 15}}>
                      <h4>{mapping[i] + ":"} </h4>

                      <input {...register(mapping[i])} style={{width: 280, fontSize: 19, alignItems:"center", justifyContent:"center", alignContent:"center", backgroundColor:"lightcyan"}}/>
                      </div>
                    )
                      : null}

                    </div>
                  )
                })
              }
              <div style={{display:"flex", alignItems:"center", justifyContent : "center", marginTop: 15}}>
              <input type="submit" style={{width: 150, height: 45, backgroundColor:"blue", color:"#fff", borderRadius: 45, fontSize: 20}}/>
              </div>
            </form>
          </Box>
        </Modal>
      ) :
        null}
        <ToastContainer 
          position="top-left"
          type="success"
          theme="colored"
        />
    </div>
  )
}

export default Main