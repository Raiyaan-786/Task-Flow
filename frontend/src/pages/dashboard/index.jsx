import React, { useState } from 'react';
import { Box, useTheme, Typography, Divider, Tabs, Tab, Button, IconButton } from "@mui/material";
import { tokens } from '../../theme';
import StatBox from '../../components/StatBox';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/system';
import MainDashboard from './MainDashboard';
import EmployeeDashboard from './EmployeeDashboard'
import WorkDashboard from './WorkDashboard';
import CustomerDashboard from './CustomerDashboard';
import TotalWorks from './individualworks/TotalWorks';
import AssignedWorks from './individualworks/AssignedWorks';
import CompletedWorks from './individualworks/CompletedWorks';
import UnassignedWorks from './individualworks/UnassignedWorks';
import HoldWorks from './individualworks/HoldWorks';
import CancelledWorks from './individualworks/CancelledWorks';

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
    // color: '#999999',
    '&.Mui-selected': {
        backgroundColor: '#007499',
        color: 'white',
    },
}));

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedTab, setSelectedTab] = useState(2);
    const [individualWorksTab, setIndividualWorksTab] = useState(-1);
    const [individualWorks, setIndividualWorks] = useState(false);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    // Click handler for StatBox to change the selected tab
    const handleStatBoxClick = (tabIndex) => {
        setIndividualWorksTab(tabIndex);
        setIndividualWorks(true)
    };

    return (
        <Box p={.1} display="flex" flexDirection="column" height={'88%'} m={'10px'}>
            <Box bgcolor={colors.primary[900]} height={'60px'} display={'flex'} borderRadius={"10px"} justifyContent={'space-evenly'}>
                <Box onClick={() => handleStatBoxClick(0)} width={'100%'} display={'felx'} ><StatBox value={3482} title={'Total Works'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(1)} width={'100%'} display={'felx'} ><StatBox value={3017} title={'Completed'} textcolor={'green'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(2)} width={'100%'} display={'felx'} ><StatBox value={96} title={'Pending'} textcolor={'orange'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(3)} width={'100%'} display={'felx'} ><StatBox value={90} title={'Assigned'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(4)} width={'100%'} display={'felx'} ><StatBox value={5} title={'Unassigned'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(5)} width={'100%'} display={'felx'} ><StatBox value={14} title={'Hold'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} />
                <Box onClick={() => handleStatBoxClick(6)} width={'100%'} display={'felx'} ><StatBox value={350} title={'Cancelled'} textcolor={'red'} /></Box>
            </Box>
            {individualWorks ?
                <Box
                    bgcolor={colors.primary[900]}
                    flexGrow={1}
                    mt="2px"
                    display="flex"
                    flexDirection="column"
                    borderRadius={'10px'}
                >

                    <Box display={individualWorksTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                        <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Total Works</Typography>
                        </Box>
                        <TotalWorks />
                    </Box>
                    <Box display={individualWorksTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                    <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Completed Works</Typography>
                        </Box>
                        <CompletedWorks/>
                    </Box>
                    <Box display={individualWorksTab === 2 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                        hello 2
                    </Box>
                    <Box display={individualWorksTab === 3 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                        <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Assigned Works</Typography>
                        </Box>
                        <AssignedWorks/>
                    </Box>
                    <Box display={individualWorksTab === 4 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                    <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Unassigned Works</Typography>
                        </Box>
                        <UnassignedWorks/>
                    </Box>
                    <Box display={individualWorksTab === 5 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                    <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Hold Works</Typography>
                        </Box>
                        <HoldWorks/>
                    </Box>
                    <Box display={individualWorksTab === 6 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                    <Box p={1} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                            <IconButton onClick={() => setIndividualWorks(false)} size='small' sx={{ bgcolor: '#007499', color: 'white', ":hover": 'black' }} >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" fontWeight={'bold'}>Cancelled Works</Typography>
                        </Box>
                        <CancelledWorks/>
                    </Box>


                </Box>
                :
                <Box
                    //this is box 2
                    bgcolor={colors.primary[900]}
                    flexGrow={1}
                    mt="2px"
                    display="flex"
                    flexDirection="column"
                    borderRadius={'10px'}

                >
                    {/* Rounded Tabs */}
                    <RoundedTabs value={selectedTab} onChange={handleTabChange} >
                        <RoundedTab label="Main Dashboard" />
                        <RoundedTab label="Employee Dashboard" />
                        <RoundedTab label="Work Dashboard" />
                        <RoundedTab label="Customer Dashboard" />
                    </RoundedTabs>
                    <Divider sx={{ borderColor: colors.bgc[100] }} />
                    {/* Render All Tab Panels Once */}
                    <Box p='0 1px' flexGrow={1} position="relative" display="flex" flexDirection="column" height={'90%'}>
                        <Box display={selectedTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                            <MainDashboard />
                        </Box>

                        <Box display={selectedTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                            <EmployeeDashboard />

                        </Box>

                        <Box display={selectedTab === 2 ? 'block' : 'none'} flexGrow={1} height={'100%'}>
                            <WorkDashboard />
                        </Box>

                        <Box display={selectedTab === 3 ? 'block' : 'none'} flexGrow={1}>
                            <CustomerDashboard />
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    );
};

export default Dashboard;
