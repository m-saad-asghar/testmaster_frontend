import { Box, Button, Typography, Modal, TextField, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
export const SubjectModal = (props) => {
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

  const [subjectName, setSubjectName] = useState('');
  
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
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

  const closeSubjectModal = () => {
    props.closeSubject();
    setValidationerrors({})
  };

  
   const onChangeSubjectName = (e) => {
    setSubjectName(e.target.value);
  };

  

  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (subjectName === null || subjectName === "" || subjectName === undefined) {
      isValid = false;
      validationerrors["subjectName"] = "Subject Name is required.";
    }
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitSubject = () => {
    if (validate()){
      setIsSubjectLoading(true);
      const data = {
        subjectName: subjectName,
        
      };

      addNewSubject(data);

      console.log("debugging data", data)
      if (currentId == ''){
        // addNewProduct(data);
      }else{
        // updateProduct(data);
      }
    }
  }

  const addNewSubject = (data) => {
    fetch(baseUrl + 'add_new_subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsSubjectLoading(false);
        if (data.success == 1){
          toast.success("Subject is Successfully Saved!")
          props.setSubjects(data.subjects)
        props.closeSubjectModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSubjectLoading(false);
      });
    closeSubjectModal(true);
  };

  const resetForm = () => {
    setSubjectName('');
    
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.SubjectModal}
        onClose={props.closeSubject}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Subject" : "Update Subject"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="name" style={{ position: 'unset' }}>Name <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="name"
                  aria-describedby="name"
                  error={Boolean(validationerrors.subjectName)}
                  onChange={onChangeSubjectName}
                  style={{ minWidth: '95%' }}
                  value={subjectName}
                  helperText={validationerrors.subjectName || ""}
                  variant="standard"
                />
              </Grid>
               
              </Grid>

             
            
             
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isSubjectLoading}  onClick={closeSubjectModal}>Cancel</Button>
            <Button variant="contained" disabled={isSubjectLoading} onClick={submitSubject}> {isSubjectLoading ? (
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