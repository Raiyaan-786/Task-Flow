import React, { useState } from 'react'
import { Box, Divider, styled, Tab, Tabs, Typography } from '@mui/material'
import Header from '../../components/Header'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import AddWork from './AddWork';
import AddTurnoverCertificate from './AddTurnover';
import TurnoverList from './TurnoverList';
import WorkList from './WorkList';

const RoundedTabs = styled(Tabs)({
    // background:'red',A
    padding: '10px',
    minHeight: '40px',
    '& .MuiTabs-indicator': {
        display: 'none', // Remove the default indicator
    },
});

const RoundedTab = styled(Tab)(({ theme }) => ({
    
    marginRight: '5px',
    textTransform: 'none',
    fontWeight: 400,
    borderRadius: '10px',
    minHeight: '35px',
    padding: '0px 10px',
    color: 'obsidian',
    // color: '#999999',
    '&.Mui-selected': {
        backgroundColor: '#007499',
        color: 'white',
    },
}));

const WorkManager = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    return (
        <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
            <Header title={'Work Manager'}/>
            <Box
                bgcolor={colors.primary[900]}
                flexGrow={1}
                mt="2px"
                display="flex"
                flexDirection="column"
                borderRadius={'10px'}

            >
                {/* Rounded Tabs */}
                <RoundedTabs value={selectedTab} onChange={handleTabChange} >
                    <RoundedTab label="Add Work" />
                    <RoundedTab label="Add Turnover" />
                    <RoundedTab label="Turnover List" />
                    <RoundedTab label="Work List" />
                </RoundedTabs>
                <Divider  sx={{borderColor:colors.bgc[100]}}/>
                {/* Render All Tab Panels Once */}
                <Box p='0 1px' flexGrow={1} position="relative" display="flex" flexDirection="column" height={'90%'}>
                    <Box display={selectedTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                       <AddWork/>
                    </Box>

                    <Box display={selectedTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                       <AddTurnoverCertificate/>
                    </Box>

                    <Box display={selectedTab === 2 ? 'block' : 'none'} flexGrow={1} height={'100%'}>
                        <TurnoverList/>
                    </Box>

                    <Box display={selectedTab === 3 ? 'block' : 'none'} flexGrow={1} height={'100%'}>
                        <WorkList/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default WorkManager