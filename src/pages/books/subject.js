import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { BooksSearch } from "src/components/books/BooksSearch";
import { applyPagination } from "src/utils/apply-pagination";
import { SubjectModal } from "src/components/books/SubjectModal";
import { useRouter } from "next/router";

const now = new Date();

const data = [
  {
    id: "5e887ac47eed253091be10cb",
    address: {
      city: "Cleveland",
      country: "USA",
      state: "Ohio",
      street: "2849 Fulton Street",
    },
    avatar: "/assets/avatars/avatar-carson-darrin.png",
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: "carson.darrin@devias.io",
    name: "Carson Darrin",
    phone: "304-428-3097",
  },
  
];

const useSubjects = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useSubjectIds = (subjects) => {
  return useMemo(() => {
    return subjects.map((subject) => subject.id);
  }, [subjects]);
};

const Subjects = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const subjects = useSubjects(page, rowsPerPage);
  const subjectIds = useSubjectIds(subjects);
  const customersSelection = useSelection(subjectIds);
  const [SubjectModalStatus, setSubjectModal] = useState(false);
  const [currentData, setCurrentData] = useState("");
  const [subject, setSubjects] = useState([]);
  const router = useRouter();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openSubjectModal = (e) => {
    setSubjectModal(true);
  };

  const closeSubjectModal = (e) => {
    setSubjectModal(false);
    setCurrentData("");
  };

  return (
    <>
      <Head>
        <title>Subjects | Test Master</title>
      </Head>
      <SubjectModal
        SubjectModal={SubjectModalStatus}
        closeSubject={closeSubjectModal}
        currentData={currentData}
        setSubjects={setSubjects}
        closeSubjectModal={closeSubjectModal}
      />
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
                <Typography variant="h4">Subjects</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={openSubjectModal}
                >
                  Add Subject
                </Button>
              </div>
            </Stack>
            <BooksSearch />
            <CustomersTable
              count={data.length}
              items={subjects}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Subjects.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Subjects;
