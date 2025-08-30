import { CircularProgress, Box } from '@mui/material'


export function LoadingSpinner() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={70} style={{ color: '#00006A' }}/>
    </Box>
  )
}
