import React, { useState } from 'react';
import { Box, Divider, styled, Tab, Tabs } from '@mui/material';
import Header from '../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import AddCustomer from './AddCustomer';
import CustomerGroup from './CustomerGroup';
import CustomerList from './CustomerList';
import MutedCustomers from './MutedCustomers';

const RoundedTabs = styled(Tabs)({
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
    '&.Mui-selected': {
        backgroundColor: '#007499',
        color: 'white',
    },
}));

const CustomerManager = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Lazy render tab content
    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <AddCustomer />;
            case 1:
                return <CustomerGroup />;
            case 2:
                return <CustomerList />;
            case 3:
                return <MutedCustomers />;
            default:
                return null;
        }
    };

    return (
        <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={0.1}>
            <Header title={'Customer Management'} />
            <Box
                bgcolor={colors.primary[900]}
                flexGrow={1}
                mt="2px"
                display="flex"
                flexDirection="column"
                borderRadius={'10px'}
            >
                {/* Rounded Tabs */}
                <RoundedTabs value={selectedTab} onChange={handleTabChange}>
                    <RoundedTab label="Add Customer" />
                    <RoundedTab label="Customer Group" />
                    <RoundedTab label="Customer List" />
                    {/* <RoundedTab label="Muted Customers" /> */}
                </RoundedTabs>
                <Divider sx={{ borderColor: colors.bgc[100] }} />
                {/* Render only the selected tab */}
                <Box p="0 1px" flexGrow={1} position="relative" display="flex" flexDirection="column" height={'90%'}>
                    {renderTabContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerManager;
