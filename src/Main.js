import React, { useState } from "react";
import Papa from "papaparse";
import CreateTable from './Table'
import axios from 'axios';
import SearchBar from "material-ui-search-bar";
import cssVars from "@mui/system/cssVars";


function createData(name, fatherName, dob, address) {
  return { name, fatherName, dob, address };
}


// Allowed extensions for input file
const allowedExtensions = ["csv"];


const formData = new FormData();

function Main() {


  const [rows, setRows] = React.useState([]);
  const [filteredRow, setFilteredRow] = useState([])
  const [cols1, setCols1] = useState([])
  const [cols2, setCols2] = useState([])
  let tempRows = []
  const [rows2, setRows2] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);

  const makeApiCall = async () => {
    console.log("luah", formData.get('csv1'));
    console.log("luah2", formData.get('csv2'));
    const url = "http://localhost:8000/backend/upload-csv/"
    try {
      const res = await axios.post(url, formData);
      console.log(res)
    } catch (error) {
      console.error(error);
    }

    // const url2 = "http://localhost:8000/backend/fetch-results/?idx=200"

    // try {
    //   const res = await axios.get(url2);
    //   console.log(res)
    // } catch (error) {
    //   console.error(error);
    // }
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
      console.log("columns", csv.meta.fields);
      let letTemp = []
      letTemp.push({ id: 'number', label: 'S. No', minWidth: 170 })
      csv.meta.fields.map(col => {
        if(col!=""){
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

    rows.map(row => {
      if (rows.indexOf(row) == searchedVal) {
        let newArr = []
        newArr.push(row)
        setFilteredRow(newArr)
      }

    })

  };

  const cancelSearch = () => {
    setSearchedVal("");
    requestSearch(searchedVal);
  };

  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input
        onChange={(event) => handleFileChange(event, 1)}
        id="csvInput"
        name="file"
        type="File"
      />
      {loading ? <div>Loading...</div> : null}

      {!loading && file != "" && (
        <>
          <SearchBar
            value={searchedVal}
            onChange={(searchVal) => requestSearch(searchVal)}
          />
          <CreateTable cols={cols1} rows={filteredRow.length != 0 ? filteredRow : rows} loading={loading} file={file} />
        </>
      )}
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input
        onChange={(event) => handleFileChange(event, 2)}
        id="csvInput2"
        name="file"
        type="File"
      />
      {loading2 ? <div>Loading...</div> : null}

      {!loading2 && file2 != "" && (
        <CreateTable cols={cols2} rows={rows2} loading={loading} file={file} />
      )}
    </div>
  )
}

export default Main