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
import { TopicModal } from "src/components/books/TopicModal";
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

const useTopics = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useTopicIds = (topics) => {
  return useMemo(() => {
    return topics.map((topic) => topic.id);
  }, [topics]);
};

const Topics = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const topics = useTopics(page, rowsPerPage);
  const topicIds = useTopicIds(topics);
  const customersSelection = useSelection(topicIds);
  const [TopicModalStatus, setTopicModal] = useState(false);
  const [currentData, setCurrentData] = useState("");
  const [topic, setTopics] = useState([]);
  const router = useRouter();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openTopicModal = (e) => {
    setTopicModal(true);
  };

  const closeTopicModal = (e) => {
    setTopicModal(false);
    setCurrentData("");
  };

  return (
    <>
      <Head>
        <title>Topics | Test Master</title>
      </Head>
      <TopicModal
        TopicModal={TopicModalStatus}
        closeTopic={closeTopicModal}
        currentData={currentData}
        setTopics={setTopics}
        closeTopicModal={closeTopicModal}
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
                <Typography variant="h4">Topics</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={openTopicModal}
                >
                  Add Topic
                </Button>
              </div>
            </Stack>
            <BooksSearch />
            <CustomersTable
              count={data.length}
              items={topics}
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

Topics.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Topics;
