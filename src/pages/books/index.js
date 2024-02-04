import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, TableCell, TableRow, Checkbox } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { BooksSearch } from "src/components/books/BooksSearch";
import { applyPagination } from "src/utils/apply-pagination";
import { BookModal } from "src/components/books/BookModal";
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { TableComponent } from 'src/components/table-component';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const now = new Date();

// const data = [
//   {
//     id: "5e887ac47eed253091be10cb",
//     address: {
//       city: "Cleveland",
//       country: "USA",
//       state: "Ohio",
//       street: "2849 Fulton Street",
//     },
//     avatar: "/assets/avatars/avatar-carson-darrin.png",
//     createdAt: subDays(subHours(now, 7), 1).getTime(),
//     email: "carson.darrin@devias.io",
//     name: "Carson Darrin",
//     phone: "304-428-3097",
//   },
//   {
//     id: "5e887b209c28ac3dd97f6db5",
//     address: {
//       city: "Atlanta",
//       country: "USA",
//       state: "Georgia",
//       street: "1865  Pleasant Hill Road",
//     },
//     avatar: "/assets/avatars/avatar-fran-perez.png",
//     createdAt: subDays(subHours(now, 1), 2).getTime(),
//     email: "fran.perez@devias.io",
//     name: "Fran Perez",
//     phone: "712-351-5711",
//   },
//   {
//     id: "5e887b7602bdbc4dbb234b27",
//     address: {
//       city: "North Canton",
//       country: "USA",
//       state: "Ohio",
//       street: "4894  Lakeland Park Drive",
//     },
//     avatar: "/assets/avatars/avatar-jie-yan-song.png",
//     createdAt: subDays(subHours(now, 4), 2).getTime(),
//     email: "jie.yan.song@devias.io",
//     name: "Jie Yan Song",
//     phone: "770-635-2682",
//   },
//   {
//     id: "5e86809283e28b96d2d38537",
//     address: {
//       city: "Madrid",
//       country: "Spain",
//       name: "Anika Visser",
//       street: "4158  Hedge Street",
//     },
//     avatar: "/assets/avatars/avatar-anika-visser.png",
//     createdAt: subDays(subHours(now, 11), 2).getTime(),
//     email: "anika.visser@devias.io",
//     name: "Anika Visser",
//     phone: "908-691-3242",
//   },
//   {
//     id: "5e86805e2bafd54f66cc95c3",
//     address: {
//       city: "San Diego",
//       country: "USA",
//       state: "California",
//       street: "75247",
//     },
//     avatar: "/assets/avatars/avatar-miron-vitold.png",
//     createdAt: subDays(subHours(now, 7), 3).getTime(),
//     email: "miron.vitold@devias.io",
//     name: "Miron Vitold",
//     phone: "972-333-4106",
//   },
//   {
//     id: "5e887a1fbefd7938eea9c981",
//     address: {
//       city: "Berkeley",
//       country: "USA",
//       state: "California",
//       street: "317 Angus Road",
//     },
//     avatar: "/assets/avatars/avatar-penjani-inyene.png",
//     createdAt: subDays(subHours(now, 5), 4).getTime(),
//     email: "penjani.inyene@devias.io",
//     name: "Penjani Inyene",
//     phone: "858-602-3409",
//   },
//   {
//     id: "5e887d0b3d090c1b8f162003",
//     address: {
//       city: "Carson City",
//       country: "USA",
//       state: "Nevada",
//       street: "2188  Armbrester Drive",
//     },
//     avatar: "/assets/avatars/avatar-omar-darboe.png",
//     createdAt: subDays(subHours(now, 15), 4).getTime(),
//     email: "omar.darobe@devias.io",
//     name: "Omar Darobe",
//     phone: "415-907-2647",
//   },
//   {
//     id: "5e88792be2d4cfb4bf0971d9",
//     address: {
//       city: "Los Angeles",
//       country: "USA",
//       state: "California",
//       street: "1798  Hickory Ridge Drive",
//     },
//     avatar: "/assets/avatars/avatar-siegbert-gottfried.png",
//     createdAt: subDays(subHours(now, 2), 5).getTime(),
//     email: "siegbert.gottfried@devias.io",
//     name: "Siegbert Gottfried",
//     phone: "702-661-1654",
//   },
//   {
//     id: "5e8877da9a65442b11551975",
//     address: {
//       city: "Murray",
//       country: "USA",
//       state: "Utah",
//       street: "3934  Wildrose Lane",
//     },
//     avatar: "/assets/avatars/avatar-iulia-albu.png",
//     createdAt: subDays(subHours(now, 8), 6).getTime(),
//     email: "iulia.albu@devias.io",
//     name: "Iulia Albu",
//     phone: "313-812-8947",
//   },
//   {
//     id: "5e8680e60cba5019c5ca6fda",
//     address: {
//       city: "Salt Lake City",
//       country: "USA",
//       state: "Utah",
//       street: "368 Lamberts Branch Road",
//     },
//     avatar: "/assets/avatars/avatar-nasimiyu-danai.png",
//     createdAt: subDays(subHours(now, 1), 9).getTime(),
//     email: "nasimiyu.danai@devias.io",
//     name: "Nasimiyu Danai",
//     phone: "801-301-7894",
//   },
// ];

// const useCustomers = (page, rowsPerPage) => {
//   return useMemo(() => {
//     return applyPagination(data, page, rowsPerPage);
//   }, [page, rowsPerPage]);
// };

// const useCustomerIds = (customers) => {
//   return useMemo(() => {
//     return customers.map((customer) => customer.id);
//   }, [customers]);
// };

const tableHeaders = [
  "Name",
  "Level",
  "Publisher",
  "Subject",
  "Syllabus",
  "Added Date",
  "Status",
  "Actions"
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

  const useBooks = (page, rowsPerPage, books) => {
    return useMemo(
      () => {
        return applyPagination(books, page, rowsPerPage);
      },
      [page, rowsPerPage, books]
    );
  };

  const useBookIds = (books) => {
    return useMemo(
      () => {
        return books.map((book) => book.id);
      },
      [books]
    );
  };

const Books = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const customers = useCustomers(page, rowsPerPage);
  // const customersIds = useCustomerIds(customers);
  // const customersSelection = useSelection(customersIds);
  const [BookModalStatus, setBookModal] = useState(false);
  const [currentData, setCurrentData] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const router = useRouter();
  const book_data = useBooks(page, rowsPerPage, books);
    const booksIds = useBookIds(books);
    const booksSelection = useSelection(booksIds);
    const selectedSome = (booksSelection.selected.length > 0) && (booksSelection.selected.length < book_data.length);
  const selectedAll = (book_data.length > 0) && (booksSelection.selected.length === book_data.length);

  useEffect(() => {
    getBooks();
  }, []);

  const handleUpdateBook = (data) => {
    getUpdateData(data);
  };

  const startLoading = () => {
    setIsDataLoading(true);
  }

  const stopLoading = () => {
    setIsDataLoading(false);
  }

  const getUpdateData = (data) => {
    setCurrentData(data);
    setBookModal(true);
  };

  const dateFormat = (d) => {
    const date = new Date(d);
    
    const months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    
    const formattedDate = `${day} ${months[monthIndex]}, ${year}`;
    return formattedDate;
  };

  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    changeStatus(data);
  };

  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_book/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == 0){
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
  };

  const getBooks = () => {
    const data  = {
      search_term: ""
    }
    fetch(baseUrl + 'get_books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setBooks(data.books);
      })
      .catch(error => console.error(error));
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const tableBody = () => {
    return <>
    {book_data && book_data.map((book) => {
                  const isSelected = booksSelection.selected.includes(book.id);
                  return (
                    <TableRow
                      hover
                      key={book.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              booksSelection.handleSelectOne?.(book.id);
                            } else {
                              booksSelection.handleDeselectOne?.(book.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {book.bookName}
                      </TableCell>
                      <TableCell>
                        {book.level}
                      </TableCell>
                      <TableCell>
                        {book.publisher}
                      </TableCell>
                      <TableCell>
                        {book.subject}
                      </TableCell>
                      <TableCell>
                      {book.syllabus.split(',').map(topic => topic.trim()).map((topic, index) => (
                      <Chip style={{marginRight: "10px", marginBottom: "10px"}} key={index} label={topic} />
                       ))}
                      </TableCell>
                      <TableCell>
                        {
                          dateFormat(book.created_at)
                        }
                      </TableCell>
                      <TableCell>
                        <Switch defaultChecked={book.status == 1 ? true : false} onChange={onChangeEnable.bind(this, book.id)}/>
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateBook.bind(this, book)} /></Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
    </>
  }

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openBookModal = (e) => {
    setBookModal(true);
  };

  const getLatestBooks = (data) => {
    setBooks(data);
  };

  const closeBookModal = (e) => {
    setBookModal(false);
    setCurrentData("");
  };

  const tableHeader = () => {
    return <>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={(selectedAll)}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          booksSelection.handleSelectAll?.();
                        } else {
                          booksSelection.handleDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  
                  {tableHeaders && tableHeaders.map((header, index) => (
                    <TableCell key={index} style={{minWidth: 150}}>
                      {header}
                    </TableCell>
                  ))}
    </>
  }

  return (
    <>
      <Head>
        <title>All Books | Test Master</title>
      </Head>
      <ToastContainer />
      <BookModal
        BookModal={BookModalStatus}
        closeBook={closeBookModal}
        currentData={currentData}
        setBooks={setBooks}
        closeBookModal={closeBookModal}
      />
      <Modal
          open={isDataLoading}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            {<CircularProgress
              size={100}
              style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
            />}
        </Modal>
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
              <Stack spacing={1}>
                <Typography variant="h4">Books</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={openBookModal}
                >
                  Add Book
                </Button>
              </div>
            </Stack>
            <BooksSearch sendBooks={getLatestBooks} startLoading={startLoading} stopLoading={stopLoading}/>

            <TableComponent
                tableHeader={tableHeader}
                tableBody={tableBody}
                count={books.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
              />

            {/* <CustomersTable
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            /> */}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Books.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Books;
