import React, { useState } from 'react';
import { Box, useTheme, Typography, Divider, Tabs, Tab } from "@mui/material";
import { tokens } from '../../theme';
import StatBox from '../../components/StatBox';
import { AssignmentLateOutlined, AssignmentTurnedInOutlined, DateRangeRounded, EventAvailableRounded, HighlightOffRounded, PauseCircleOutlineRounded, ScheduleRounded } from '@mui/icons-material';
import { styled } from '@mui/system';
import MainDashboard from './MainDashboard';
import EmployeeDashboard from './EmployeeDashboard'
import WorkDashboard from './WorkDashboard';
import CustomerDashboard from './CustomerDashboard';

const RoundedTabs = styled(Tabs)({
    padding: '10px', 
    minHeight: '40px', 
    '& .MuiTabs-indicator': {
        display: 'none', // Remove the default indicator
    },
});

const RoundedTab = styled(Tab)(({ theme }) => ({
    marginRight:'5px',
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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box p={.1} display="flex" flexDirection="column" height={'88%'} m={'10px'}>
            <Box  bgcolor={colors.primary[900]} height={'60px'} display={'flex'} borderRadius={"10px"} justifyContent={'space-evenly'}>
                <StatBox value={3482} title={'Total Works'}  icon={<DateRangeRounded fontSize='small' htmlColor='blue' />} divider={true} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}}/>
                <StatBox value={3017} title={'Completed'} textcolor={'green'} icon={<EventAvailableRounded fontSize='small' htmlColor='green' />} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}}/>
                <StatBox value={96} title={'Pending'} textcolor={'orange'} icon={<ScheduleRounded fontSize='small' htmlColor='orange' />} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}}/>
                <StatBox value={90} title={'Assigned'}  icon={<AssignmentTurnedInOutlined fontSize='small' htmlColor='pink' />} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}}/>
                <StatBox value={5} title={'Unassigned'} icon={<AssignmentLateOutlined fontSize='small' htmlColor='blue' />} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}}/>
                <StatBox value={14} title={'Hold'}  icon={<PauseCircleOutlineRounded fontSize='small' htmlColor='grey' />} />
                <Divider orientation='vertical' sx={{borderColor:colors.bgc[100]}} />
                <StatBox value={350} title={'Cancelled'} textcolor={'red'} icon={<HighlightOffRounded fontSize='small' htmlColor='red' />} />
            </Box>

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
                    <RoundedTab label="Main Dashboard" />
                    <RoundedTab label="Employee Dashboard" />
                    <RoundedTab label="Work Dashboard" />
                    <RoundedTab label="Customer Dashboard" />
                </RoundedTabs>
                <Divider  sx={{borderColor:colors.bgc[100]}}/>
                {/* Render All Tab Panels Once */}
                <Box p='0 1px' flexGrow={1} position="relative" display="flex" flexDirection="column" height={'90%'}>
                    <Box display={selectedTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} > 
                        <MainDashboard/>
                    </Box>

                    <Box display={selectedTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                        <EmployeeDashboard/>
                        
                    </Box>

                    <Box display={selectedTab === 2 ? 'block' : 'none'} flexGrow={1} height={'100%'}>
                       <WorkDashboard/>
                    </Box>

                    <Box display={selectedTab === 3 ? 'block' : 'none'} flexGrow={1}>
                        <CustomerDashboard/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
