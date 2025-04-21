import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { tokens } from '../theme';
import './CustomToolbar.css'; // Make sure to import your CSS

const CustomToolbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box className="custom-toolbar" sx={{display:'flex', background: colors.foreground[100], color: colors.grey[100] }} ml={2} >
            <GridToolbarContainer sx={{gap:0}}>
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
                {/* Custom Quick Filter without hover styles */}
                <GridToolbarQuickFilter
                    sx={{
                        ml:3,
                        height:'28px',
                        width:'200px',
                        padding: ' 2px 5px 0px 10px',
                        borderRadius: '5px',
                        bgcolor: colors.bgc[100],
                    }}
                />
            </GridToolbarContainer>
        </Box>
    );
}

export default CustomToolbar;
