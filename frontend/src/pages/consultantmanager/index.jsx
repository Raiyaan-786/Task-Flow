import React, { useState } from 'react'
import { Box, Divider, styled, Tab, Tabs, Typography } from '@mui/material'
import Header from '../../components/Header'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import AddConsultant from './AddConsultant';
import ConsultantList from './ConsultantList';


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

const ConsultantManager = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    return (
        <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
            <Header title={'Consultant Manager'}/>
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
                    <RoundedTab label="Add Consultant" />
                    <RoundedTab label="Consultant List" />
                </RoundedTabs>
                <Divider  sx={{borderColor:colors.bgc[100]}}/>
                {/* Render All Tab Panels Once */}
                <Box p='0 1px' flexGrow={1} position="relative" display="flex" flexDirection="column" height={'90%'}>
                    <Box display={selectedTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                       <AddConsultant/>
                    </Box>

                    <Box display={selectedTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                       <ConsultantList/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ConsultantManager