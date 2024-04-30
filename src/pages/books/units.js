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
import { UnitModal } from "src/components/books/UnitModal";
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

const useUnits = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useUnitIds = (units) => {
  return useMemo(() => {
    return units.map((unit) => unit.id);
  }, [units]);
};

const Units = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const units = useUnits(page, rowsPerPage);
  const unitIds = useUnitIds(units);
  const customersSelection = useSelection(unitIds);
  const [UnitModalStatus, setUnitModal] = useState(false);
  const [currentData, setCurrentData] = useState("");
  const [unit, setUnits] = useState([]);
  const router = useRouter();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openUnitModal = (e) => {
    setUnitModal(true);
  };

  const closeUnitModal = (e) => {
    setUnitModal(false);
    setCurrentData("");
  };

  return (
    <>
      <Head>
        <title>Units | Test Master</title>
      </Head>
      <UnitModal
        UnitModal={UnitModalStatus}
        closeUnit={closeUnitModal}
        currentData={currentData}
        setUnits={setUnits}
        closeUnitModal={closeUnitModal}
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
                <Typography variant="h4">Units</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={openUnitModal}
                >
                  Add Unit
                </Button>
              </div>
            </Stack>
            <BooksSearch />
            <CustomersTable
              count={data.length}
              items={units}
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

Units.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Units;
