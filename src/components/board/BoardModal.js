import { Box, Button, Typography, Modal, TextField, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
export const BoardModal = (props) => {
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

  const [boardName, setBoardName] = useState('');
  
  const [isBoardLoading, setIsBoardLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();
    }
    
  }, []);

  const closeBoardModal = () => {
    props.closeBoard();
    setValidationerrors({})
  };

  
   const onChangeBoardName = (e) => {
    setBoardName(e.target.value);
  };

  

  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (boardName === null || boardName === "" || boardName === undefined) {
      isValid = false;
      validationerrors["boardName"] = "Board Name is required.";
    }
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitBoard = () => {
    if (validate()){
      setIsBoardLoading(true);
      const data = {
        name: boardName,
        
      };

      addNewBoard(data);

      console.log("debugging data", data)
      if (currentId == ''){
        // addNewProduct(data);
      }else{
        // updateProduct(data);
      }
    }
  }

  const addNewBoard = (data) => {
    fetch(baseUrl + 'add-new-board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsBoardLoading(false);
        if (data.success == 1){
          toast.success("Board is Successfully Saved!")
          props.setBoards(data.boards)
        props.closeBoardModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsBoardLoading(false);
      });
    closeBoardModal(true);
  };

  const resetForm = () => {
    setBoardName('');
    
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.BoardModal}
        onClose={props.closeBoard}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Board" : "Update Board"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="name" style={{ position: 'unset' }}>Name <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="name"
                  aria-describedby="name"
                  error={Boolean(validationerrors.boardName)}
                  onChange={onChangeBoardName}
                  style={{ minWidth: '95%' }}
                  value={boardName}
                  helperText={validationerrors.boardName || ""}
                  variant="standard"
                />
              </Grid>
               
              </Grid>

             
            
             
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isBoardLoading}  onClick={closeBoardModal}>Cancel</Button>
            <Button variant="contained" disabled={isBoardLoading} onClick={submitBoard}> {isBoardLoading ? (
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