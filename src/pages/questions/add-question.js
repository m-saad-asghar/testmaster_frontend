import { useState, useEffect } from "react";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import "react-toastify/dist/ReactToastify.css";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuestion = () => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [question, setQuestion] = useState("");
  const [validationerrors, setValidationerrors] = useState({});
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [answer, setAnswer] = useState([{ input: "", option: "" }]);
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState([]);
  const [unit, setUnit] = useState("");
  const [examGroup, setExamGroup] = useState("");
  const [levelData, setLevelData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [examGroupData, setExamGroupData] = useState([]);
  const [books, setBooks] = useState('0');
  const [booksData, setBooksData] = useState([]);
  const [topics, setTopics] = useState('0');
  const [topicsData, setTopicsData] = useState([]);
  const [examYears, setExamYears] = useState([]);
  const [examYearsData, setExamYearsData] = useState([]);


  useEffect(() => {
    getBooks();
    getExamYears();
    /*getLevels();
    getSubjects();
    getUnits();
    getYears();
    getExamGroups();*/
  }, []);

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
  
  
  
  const getUnits = (bookId) => {
    fetch(baseUrl + "get-units-of-book/" + bookId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUnitData(data.units);
        }
      })
      .catch((error) => console.error(error));
  };
  const getTopics = (unitId) => {
    fetch(baseUrl + "get-topics-of-unit/" + unitId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTopicsData(data.topics);
        }
      })
      .catch((error) => console.error(error));
  };
  const getExamYears = () => {
    fetch(baseUrl + "get-exam-years", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setExamYearsData(data.years);
        }
      })
      .catch((error) => console.error(error));
  };
  
  const getYears = () => {
    fetch(baseUrl + "get-years", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setYearData(data.years);
        }
      })
      .catch((error) => console.error(error));
  };
  

  const backToAllQuestions = (e) => {
    router.push("/questions");
  };

  const addAnswer = () => {
    setAnswer([...answer, { input: "", option: "" }]);
  };

  const handleAnswerChange = (index, value) => {
    const updateAnswer = [...answer];
    updateAnswer[index].input = value;
    setAnswer(updateAnswer);  
  };

  const handleOptionChange = (index, option) => {
    const updateAnswer = [...answer];
    updateAnswer.forEach((item, i) => {
      if (i === index) {
        item.option = option;
      } else {
        item.option = "";
      }
    });
    setAnswer(updateAnswer);
  };

  const onChangeLevel = (e) => {
    setLevel(e.target.value);
    getSpecificSubjects(e.target.value);

  }

  const getSpecificSubjects = (level_id) => {
    fetch(baseUrl + "get-specific-subjects/" + level_id, {
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
  }

  const getSpecificUnit = (subject_id) => {
    const data = {
      "subject_id": subject_id,
      "level_id": level
    }
    fetch(baseUrl + "get-specific-units", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUnitData(data.units);
        }
      })
      .catch((error) => console.error(error));
  }

  const onChangeBook = (e) => {
    //setSubject(e.target.value);
    //getSpecificUnit(e.target.value);
    setBooks(e.target.value);
    getUnits(e.target.value);
  }

  const onChangeUnit = (e) => {
    setUnit(e.target.value)
    getTopics(e.target.value);
  }
  const onChangeTopic = (e) => {
    //setUnit(e.target.value)
    setTopics(e.target.value);
  }

  const onChangeYear = (e) => {
    setExamYears(e.target.value)
  }

  const onChangeExamGroup = (e) => {
    setExamGroup(e.target.value)
  }

  const onChangeQuestion = (e) => {
    setQuestion(e.target.value)
  }

  const handleSubmit = () => {
    const data = {
      "level": level,
      "subject": subject,
      "unit": unit,
      "year": year,
      "exam_group": examGroup,
      "question": question,
      "answers": answer
    }
    submitQuestion(data);
  };

  const submitQuestion = (data) => {
    setIsQuestionLoading(true);
    fetch(baseUrl + "add-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        setIsQuestionLoading(false);
        if (data.success) {
          toast.success("Question is Successfully Added!")
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch((error) => console.error(error));
  }

  const resetForm = () => {
    setLevel("");
    setSubject("");
    setUnit("");
    setYear([]);
    setExamGroup("");
    setQuestion("");
    setAnswer([{ input: "", option: "" }]);
  }

  return (
    <>
     <ToastContainer />
      <Head>
        <title>Add Question | Test Master</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <div>
                <Button
                  onClick={backToAllQuestions}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowLeftIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Back
                </Button>
              </div>
            </Stack>

            <Box>
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
                        {book.bookname}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <InputLabel htmlFor="unit" style={{ position: "unset" }}>
                    Unit
                  </InputLabel>
                  <Select
                    labelId="unit"
                    onChange={onChangeUnit}
                    id="unit"
                    style={{ minWidth: "100%" }}
                    value={unit}
                    error={Boolean(validationerrors.unit)}
                    helperText={validationerrors.unit || ""}
                  >
                    {unitData.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <InputLabel htmlFor="topic" style={{ position: "unset" }}>
                    Topic
                  </InputLabel>
                  <Select
                    labelId="topic"
                    onChange={onChangeTopic}
                    id="topic"
                    style={{ minWidth: "100%" }}
                    value={topics}
                    error={Boolean(validationerrors.topic)}
                    helperText={validationerrors.topic || ""}
                  >
                    {topicsData.map((topic) => (
                      <MenuItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <InputLabel htmlFor="year" style={{ position: "unset" }}>
                    Year
                  </InputLabel>
                  <Select
                    labelId="year"
                    id="year"
                    multiple
                    onChange={onChangeYear}
                    style={{ minWidth: "100%" }}
                    value={examYears}
                    error={Boolean(validationerrors.year)}
                    helperText={validationerrors.year || ""}
                  >
                    {examYearsData.map((year) => (
                      <MenuItem key={year.id} value={year.id}>
                        {year.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_name" style={{ position: "unset" }}>
                    Question
                  </InputLabel>
                  <TextField
                    style={{ width: "100%", border: "1px solid black", borderRadius: "10px" }}
                    id="question"
                    aria-describedby="question"
                    onChange={onChangeQuestion}
                    minRows={5}
                    error={Boolean(validationerrors.question)}
                    value={question}
                    helperText={validationerrors.question || ""}
                    variant="standard"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="email" style={{ position: "unset" }}>
                    Answer
                  </InputLabel>

                  {answer.map((item, index) => (
                    <div key={index}>
                      <TextField
                        style={{ width: "100%" }}
                        value={item.input}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        variant="standard"
                      />
                      <RadioGroup
                        row
                        value={item.option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      >
                        <FormControlLabel
                          value="selected"
                          control={<Radio />}
                          label="Right Answer"
                        />
                      </RadioGroup>
                    </div>
                  ))}
                  <Button variant="contained" color="primary" onClick={addAnswer}>
                    <PlusIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                style={{ marginTop: 15, display: "flex", justifyContent: "space-between" }}
              >
                <Button variant="contained" disabled={isQuestionLoading}>
                  Cancel
                </Button>
                <Button variant="contained" disabled={isQuestionLoading} onClick={handleSubmit}>
                  {" "}
                  {isQuestionLoading ? (
                    <CircularProgress
                      size={20}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: -10,
                        marginLeft: -10,
                        color: "#ffffff",
                      }}
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AddQuestion.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddQuestion;
