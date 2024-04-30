import { Box, Button, Typography, Modal, TextField, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
export const YearModal = (props) => {
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

  const [yearName, setYearName] = useState('');
  
  const [isYearLoading, setIsYearLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [board, setBoard] = useState('0');
  const [boardData, setBoardData] = useState([]);
  const [group, setGroup] = useState('0');
  const [groupData, setGroupData] = useState([]);
  const [session, setSession] = useState('0');
  const [sessionData, setSessionData] = useState([]);
  const [years, setYears] = useState('0');
  const [yearsData, setYearsData] = useState([]);
  const yearOptions = [];




  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
  }, [props.currentData]);

  useEffect(() => {
    getBoards();
    getGroups();
    getSessions();
    loadYears();
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();
    }
    
  }, []);

  const getBoards = () => {
    fetch(baseUrl + "get-boards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBoardData(data.boards);
        }
      })
      .catch((error) => console.error(error));
  };
  const getGroups = () => {
    fetch(baseUrl + "get-groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setGroupData(data.groups);
        }
      })
      .catch((error) => console.error(error));
  };
  const getSessions = () => {
    fetch(baseUrl + "get-sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSessionData(data.sessions);
        }
      })
      .catch((error) => console.error(error));
  };
  const loadYears = () => {
    const currentYear = new Date().getFullYear();
    for (let year = 2000; year <= currentYear; year++) {
        yearsData.push(year);
      }
      console.log(yearsData);
      //setYearsData(yearOptions);
  }
  const closeYearModal = () => {
    props.closeYear();
    setValidationerrors({})
  };

  
   const onChangeYearName = (e) => {
    setYearName(e.target.value);
  };

  const onChangeBoard = (e) => {
    setBoard(e.target.value);
  }
  const onChangeGroup = (e) => {
    setGroup(e.target.value);
  }
  const onChangeSession = (e) => {
    setSession(e.target.value);
  }
  const onChangeYear = (e) => {
    setYears(e.target.value);
  }
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (yearName === null || yearName === "" || yearName === undefined) {
      isValid = false;
      validationerrors["yearName"] = "Year Name is required.";
    }
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitYear = () => {
    if (validate()){
      setIsYearLoading(true);
      const data = {
        name: yearName,
        board: board,
        exam_group: group,
        session: session,
        year: years
        
      };

      addNewYear(data);

      console.log("debugging data", data)
      if (currentId == ''){
        // addNewProduct(data);
      }else{
        // updateProduct(data);
      }
    }
  }

  const addNewYear = (data) => {
    fetch(baseUrl + 'add-new-year', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsYearLoading(false);
        if (data.success == 1){
          toast.success("Year is Successfully Saved!")
          props.setYears(data.years)
        props.closeYearModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsYearLoading(false);
      });
    closeYearModal(true);
  };

  const resetForm = () => {
    setYearName('');
    setBoard('');
    setYears('');
    
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.YearModal}
        onClose={props.closeYear}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Year" : "Update Year"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="board" style={{ position: 'unset' }}>Board <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="board"
                  id="board"
                  select
                  onChange={onChangeBoard}
                  style={{ minWidth: '95%' }}
                  value={board}
                  error={Boolean(validationerrors.board)}
                  helperText={validationerrors.board || ""}
                  variant="standard"
                >
                  {
                    boardData.map((board) => (
                      <MenuItem key={board.id} value={board.id}
                      >
                        {board.name}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="group" style={{ position: 'unset' }}>Group <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="group"
                  id="group"
                  select
                  onChange={onChangeGroup}
                  style={{ minWidth: '95%' }}
                  value={group}
                  error={Boolean(validationerrors.group)}
                  helperText={validationerrors.group || ""}
                  variant="standard"
                >
                  {
                    groupData.map((group) => (
                      <MenuItem key={group.id} value={group.id}
                      >
                        {group.name}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="session" style={{ position: 'unset' }}>Session <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="session"
                  id="session"
                  select
                  onChange={onChangeSession}
                  style={{ minWidth: '95%' }}
                  value={session}
                  error={Boolean(validationerrors.session)}
                  helperText={validationerrors.session || ""}
                  variant="standard"
                >
                  {
                    sessionData.map((session) => (
                      <MenuItem key={session.id} value={session.id}
                      >
                        {session.name}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="year" style={{ position: 'unset' }}>Year <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="year"
                  id="year"
                  select
                  onChange={onChangeYear}
                  style={{ minWidth: '95%' }}
                  value={years}
                  error={Boolean(validationerrors.year)}
                  helperText={validationerrors.year || ""}
                  variant="standard"
                >
                  {
                    yearsData.map((year) => (
                      <MenuItem key={year} value={year}
                      >
                        {year}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="name" style={{ position: 'unset' }}>Name <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="name"
                  aria-describedby="name"
                  error={Boolean(validationerrors.yearName)}
                  onChange={onChangeYearName}
                  style={{ minWidth: '95%' }}
                  value={yearName}
                  helperText={validationerrors.yearName || ""}
                  variant="standard"
                />
              </Grid>
               
              </Grid>

             
            
             
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isYearLoading}  onClick={closeYearModal}>Cancel</Button>
            <Button variant="contained" disabled={isYearLoading} onClick={submitYear}> {isYearLoading ? (
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