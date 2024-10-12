import { Box, useTheme } from '@mui/material'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import React from 'react'
import { tokens } from '../theme';

const CustomToolbar = () => {
    const theme=useTheme();
    const colors=tokens(theme.palette.mode)
    return (
        <Box p={1} sx={{background: colors.primary[900],color:colors.grey[100]}}>
            <GridToolbarContainer sx={{"&.MuiBox-root":{color: `${colors.primary[900]} !important`,}}}>
                <GridToolbarColumnsButton  />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector
                    slotProps={{ tooltip: { title: 'Change density'} }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <GridToolbarExport
                    slotProps={{
                        tooltip: { title: 'Export data' },
                        button: { variant: 'outlined' },
                    }}
                />
            </GridToolbarContainer>
        </Box>
    )
}

export default CustomToolbar