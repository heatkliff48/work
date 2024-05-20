import { enqueueSnackbar } from 'notistack';

const showErrorMessage = (error) => {
  return enqueueSnackbar(error.response.data.error, { variant: 'error' });
};
export default showErrorMessage;
