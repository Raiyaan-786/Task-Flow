import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import { tokens } from '../theme';
import './CustomToolbar.css'; // Make sure to import your CSS

const CustomToolbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box className="custom-toolbar" sx={{ background: colors.primary[900], color: colors.grey[100] }} ml={2} >
            <GridToolbarContainer  >
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector
                    slotProps={{ tooltip: { title: 'Change density' } }}
                />
                <GridToolbarExport
                    slotProps={{
                        tooltip: { title: 'Export data' },
                       
                    }}
                />
            </GridToolbarContainer>
        </Box>
    );
}

export default CustomToolbar;
