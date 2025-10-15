import { enqueueSnackbar } from 'notistack';

// variant: 'success' | 'error' | 'warning' | 'info' | 'default'
export default function showMessage(text, variant = 'default', options = {}) {
  return enqueueSnackbar(text, { variant, ...options });
}
