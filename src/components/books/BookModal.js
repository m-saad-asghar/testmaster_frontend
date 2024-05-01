import { Box, Button, Typography, Modal, TextField, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
export const BookModal = (props) => {
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

  const [bookName, setBookName] = useState('');
  const [subject, setSubject] = useState('0');
  const [level, setLevel] = useState('0');
  const [publisher, setPublisher] = useState('');
  const [syllabus, setSyllabus] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [syllabusData, setSyllabusData] = useState([]);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
    setBookName((data && data.bookName != null && data.bookName != undefined) ? data.bookName : '')
    setSubject((data && data.subject_id != null && data.subject_id != null) ? data.subject_id : '0')
    setLevel((data && data.level_id != null && data.level_id != undefined) ? data.level_id : '0')
    setPublisher((data && data.publisher != null && data.publisher != undefined) ? data.publisher : '')
    setSyllabus((data && data.syllabus_id != null && data.syllabus_id != undefined) ? data.syllabus_id.split(',').map(Number) : [])
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();
    }
    getSubjects();
    getLevels();
    getSyllabus();
  }, []);

  const closeBookModal = () => {
    props.closeBook();
    setValidationerrors({})
  };

  const getLevels = () => {
    fetch(baseUrl + "get-levels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLevelData(data.levels);
        }
      })
      .catch((error) => console.error(error));
  };

  const getSyllabus = () => {
    fetch(baseUrl + "get-syllabus", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSyllabusData(data.syllabus);
        }
      })
      .catch((error) => console.error(error));
  };

  const getSubjects = () => {
    fetch(baseUrl + "get-subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSubjectData(data.subjects);
        }
      })
      .catch((error) => console.error(error));
  };

   const onChangeBookName = (e) => {
    setBookName(e.target.value);
  };

  const onChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const onChangeLevel = (e) => {
    setLevel(e.target.value);
  };

  const onChangePublisher = (e) => {
    setPublisher(e.target.value);
  };

  const onChangeSyllabus = (e) => {
    setSyllabus(e.target.value)
  };

  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (bookName === null || bookName === "" || bookName === undefined) {
      isValid = false;
      validationerrors["bookName"] = "Book Name is required.";
    }
    if (subject === null || subject == 0 || subject === undefined) {
      isValid = false;
      validationerrors["subject"] = "Subject is required.";
    }
    if (level === null || level == 0 || level === undefined) {
      isValid = false;
      validationerrors["level"] = "Level is required.";
    }
    if (publisher === null || publisher === "" || publisher === undefined) {
      isValid = false;
      validationerrors["publisher"] = "Publisher is required.";
    }
    if (syllabus === null || syllabus.length == 0 || syllabus === undefined) {
      isValid = false;
      validationerrors["syllabus"] = "Syllabus is required.";
    }

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitBook = () => {
    if (validate()){
      setIsBookLoading(true);
      const data = {
        bookName: bookName,
        subject: subject,
        level: level,
        publisher: publisher,
        syllabus: syllabus
      };

      if (currentId == ''){
        addNewBook(data);
      }else{
        updateBook(data);
      }
    }
  }

  const addNewBook = (data) => {
    fetch(baseUrl + 'add_new_book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsBookLoading(false);
        if (data.success == 1){
          toast.success("Book is Successfully Saved!")
          props.setBooks(data.books)
        closeBookModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsBookLoading(false);
      });
  };

  const updateBook = (data) => {
    fetch(baseUrl + 'update_book/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsBookLoading(false);
        if (data.success == 1){
          toast.success("Book is Successfully Updated!")
          props.setBooks(data.books)
          closeBookModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsBookLoading(false);
      });
  };

  const resetForm = () => {
    setBookName('');
    setSubject('0');
    setLevel('0');
    setPublisher('');
    setSyllabus([]);
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.BookModal}
        onClose={props.closeBook}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Book" : "Update Book"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="name" style={{ position: 'unset' }}>Name <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="name"
                  aria-describedby="name"
                  disabled={(currentId == '') ? false : true}
                  error={Boolean(validationerrors.bookName)}
                  onChange={onChangeBookName}
                  style={{ minWidth: '95%' }}
                  value={bookName}
                  helperText={validationerrors.bookName || ""}
                  variant="standard"
                />
              </Grid>
               <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="subject" style={{ position: 'unset' }}>Subject <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="subject"
                  id="subject"
                  select
                  onChange={onChangeSubject}
                  style={{ minWidth: '95%' }}
                  value={subject}
                  error={Boolean(validationerrors.subject)}
                  helperText={validationerrors.subject || ""}
                  variant="standard"
                >
                  {
                    subjectData.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}
                      >
                        {subject.title}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
               <InputLabel htmlFor="level" style={{ position: 'unset' }}>Level <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  labelId="level"
                  id="level"
                  select
                  onChange={onChangeLevel}
                  style={{ minWidth: '95%' }}
                  value={level}
                  error={Boolean(validationerrors.level)}
                  helperText={validationerrors.level || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Level</em>
                  </MenuItem>
                  {levelData.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="publisher" style={{ position: 'unset' }}>Publisher <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                <TextField
                  id="publisher"
                  aria-describedby="publisher"
                  error={Boolean(validationerrors.publisher)}
                  onChange={onChangePublisher}
                  style={{ minWidth: '95%' }}
                  value={publisher}
                  helperText={validationerrors.publisher || ""}
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
              <InputLabel htmlFor="syllabus" style={{ position: 'unset' }}>Syllabus <span style={{fontSize: '15px', color: '#FF0000'}}>*</span></InputLabel>
                  <Select
                    labelId="syllabus"
                    id="syllabus"
                    multiple
                    onChange={onChangeSyllabus}
                    style={{ minWidth: "100%" }}
                    value={syllabus}
                    error={Boolean(validationerrors.syllabus)}
                    helperText={validationerrors.syllabus || ""}
                  >
                     <MenuItem value="0">
                    <em>Select Syllabus</em>
                  </MenuItem>
                    {syllabusData.map((syllabus) => (
                      <MenuItem key={syllabus.id} value={syllabus.id}>
                        {syllabus.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationerrors.syllabus && 
                    <p style={{fontSize: '12px', color: '#FF0000', marginTop: '5px'}}>{validationerrors.syllabus}</p>
                  }
                </Grid>

              </Grid>

             
            
             
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isBookLoading}  onClick={closeBookModal}>Cancel</Button>
            <Button variant="contained" disabled={isBookLoading} onClick={submitBook}> {isBookLoading ? (
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