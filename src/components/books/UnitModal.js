import { Box, Button, Typography, Modal, TextField, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
export const UnitModal = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    minWidth: '1000px',
    p: 4
  };

  const [unitName, setUnitName] = useState('');
  
  const [isUnitLoading, setIsUnitLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [books, setBooks] = useState('0');
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
    
  }, [props.currentData]);

  useEffect(() => {
    getBooks();
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();

      
    }
    
  }, []);

  const closeUnitModal = () => {
    props.closeUnit();
    setValidationerrors({})
  };

  const getBooks = () => {
    fetch(baseUrl + "get-books", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          
          setBooksData(data.books);
          
        }
      })
      .catch((error) => console.error(error));
  };
  
   const onChangeUnitName = (e) => {
    setUnitName(e.target.value);
    
  };
  
  const onChangeBook = (e) => {
    //setSubject(e.target.value);
    //getSpecificUnit(e.target.value);
    setBooks(e.target.value);
    console.log("Book Value: " + e.target.value);
  }
  

  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (unitName === null || unitName === "" || unitName === undefined) {
      isValid = false;
      validationerrors["UnitName"] = "Unit Name is required.";
    }
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitUnit = () => {
    if (validate()){
      setIsUnitLoading(true);
      const data = {
        unitName: unitName,
        bookId: books,
      };

      addNewUnit(data);

      console.log("debugging data", data)
      if (currentId == ''){
        // addNewProduct(data);
      }else{
        // updateProduct(data);
      }
    }
  }

  const addNewUnit = (data) => {
    fetch(baseUrl + 'add-new-unit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsUnitLoading(false);
        if (data.success == 1){
          toast.success("Unit is Successfully Saved!")
          //props.setUnits(data.Units)
        props.closeUnitModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsUnitLoading(false);
      });
    closeUnitModal(true);
  };

  const resetForm = () => {
    setUnitName('');
    
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.UnitModal}
        onClose={props.closeUnit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Unit" : "Update Unit"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
                  <InputLabel htmlFor="books" style={{ position: "unset" }}>
                    Book
                  </InputLabel>
                  <Select
                    labelId="books"
                    id="books"
                    onChange={onChangeBook}
                    style={{ minWidth: "100%" }}
                    value={books}
                    error={Boolean(validationerrors.books)}
                    helperText={validationerrors.books || ""}
                  >
                    {booksData.map((book) => (
                      <MenuItem key={book.id} value={book.id}>
                        {book.bookName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="name" style={{ position: 'unset' }}>Name <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="name"
                  aria-describedby="name"
                  error={Boolean(validationerrors.UnitName)}
                  onChange={onChangeUnitName}
                  style={{ minWidth: '95%' }}
                  value={unitName}
                  helperText={validationerrors.UnitName || ""}
                  variant="standard"
                />
              </Grid>
               
              </Grid>

             
            
             
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isUnitLoading}  onClick={closeUnitModal}>Cancel</Button>
            <Button variant="contained" disabled={isUnitLoading} onClick={submitUnit}> {isUnitLoading ? (
              <CircularProgress
                size={20}
                style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
              />
            ) : 'Submit'}</Button>
          </Grid>
        </Box>
      </Modal>
  </>
  );
};