import React from 'react'
import Header from '../../components/Header'
import { Box } from '@mui/material'
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';

const Settings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
            <Header title={'Settings'} />
            <Box
                bgcolor={colors.primary[900]}
                flexGrow={1}
                mt="2px"
                display="flex"
                flexDirection="column"
                borderRadius={'10px'}
            >
                ge
            </Box>
        </Box>
    )
}

export default Settings