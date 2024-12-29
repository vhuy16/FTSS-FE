import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
    return (
        <Box sx={{ display: 'flex', width: '1rem', height: '1rem' }}>
            <CircularProgress color="inherit" style={{ width: '1rem', height: '1rem' }} />
        </Box>
    );
}
