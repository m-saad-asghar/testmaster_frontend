import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const BooksSearch = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const filterBooks = (event) => {
    props.startLoading();
    const data  = {
      search_term: event.target.value
    };
    fetch(baseUrl + 'get_books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        props.sendBooks(data.books)
        props.stopLoading();
      })
      .catch(error => console.error(error));
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search Books"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
        onChange={filterBooks}
      />
    </Card>
  );
};