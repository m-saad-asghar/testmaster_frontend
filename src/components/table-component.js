import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const TableComponent = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0
  } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {props.tableHeader()}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.tableBody()}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

TableComponent.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};