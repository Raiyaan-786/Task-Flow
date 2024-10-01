import React from 'react'
import { Box, Paper, useTheme, Typography, IconButton } from "@mui/material"
import Header from '../../components/Header'
import { BarChart, PieChart } from '@mui/x-charts'
import { tokens } from '../../theme'
import StatBox from '../../components/StatBox'
import { DownloadOutlined, Email, PersonAdd, PointOfSale, Traffic } from '@mui/icons-material'
import { mockTransactions } from '../../data/mockData'
import LineChartM from '../../components/LineChart'
import BarChartM from '../../components/BarChart'
import PieChartM from '../../components/PieChart'
import AreaChartM from '../../components/AreaChart'
import GaugeChart from '../../components/GaugeChart'

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    return (
        <Box p={2} m="20px">
            {/* <Header title={"DASHBOARD"} subtitle={"Welcome to your dashboard"} /> */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="90px"
                gap="25px"
            // overflow={'auto'}
            // height={'65vh'}
            >
                {/* first row */}
                <Box
                    borderRadius={2}
                    gridColumn="span 2"
                    backgroundColor={colors.primary[900]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="New Tasks"
                        subtitle="7,342"
                        icon={'increase'}
                        increase="+17.03%"
                    />
                </Box>
                <Box
                    borderRadius={2}
                    gridColumn="span 2"
                    backgroundColor={colors.primary[900]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="Emails Sent"
                        subtitle="721K"
                        increase="+14%"
                    />
                </Box>
                <Box
                    borderRadius={2}
                    gridColumn="span 2"
                    backgroundColor={colors.primary[900]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="New Clients"
                        subtitle="1,156"
                        increase="+15.03%"
                        icon={'increase'}
                    />
                </Box>
                <Box
                    borderRadius={2}
                    gridColumn="span 2"
                    backgroundColor={colors.primary[900]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="Income"
                        subtitle="$3772"
                        increase="+23%"
                        icon={'increase'}
                    />
                </Box>
                {/* sfsfsf */}
                <Box
                    borderRadius={2}
                    gridColumn="span 4"
                    gridRow="span 2"
                    backgroundColor={colors.primary[900]}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ padding: "15px 30px 20px 30px" }}
                    >
                        Sales Quantity
                    </Typography>
                    <Box height="150px" mt="-20px"  >
                        <PieChartM />
                        {/* <GaugeChart/> */}
                    </Box>
                </Box>
                {/* sfsfsf */}
          

                {/* second row */}
                <Box
                    gridColumn="span 5"
                    gridRow="span 4"
                    borderRadius={2}
                    backgroundColor={colors.primary[900]}

                >
                    <Box
                        mt="10px"
                        p="5px  30px 20px 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display={'flex'} m={"5px 0"}>
                            <Typography
                                variant="p"
                                fontWeight="bold"
                                color={colors.grey[100]}
                            >
                                Revenue Generated :
                            </Typography>
                            <Typography
                                variant="p"
                                fontWeight="bold"
                                color={colors.pink[500]}
                            >
                                $59,342.32
                            </Typography>
                        </Box>
                    </Box>
                    <Box height="90%" m="-20px 0 0 15px">
                        <LineChartM />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 3"
                    gridRow="span 4"
                    backgroundColor={colors.primary[900]}
                    overflow="auto"
                    borderRadius={2}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.bgc[100]}`}
                        colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h6" fontWeight="bold">
                            Recent Transactions
                        </Typography>
                    </Box>
                    {mockTransactions.map((transaction, i) => (
                        <Box
                            key={`${transaction.txId}-${i}`}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.bgc[100]}`}
                            p="15px"
                        >
                            <Box>
                                <Typography
                                    color={colors.teal[500]}
                                    variant="p"
                                    fontWeight="600"
                                >
                                    {transaction.txId}
                                </Typography>
                                <Typography color={colors.grey[100]}>
                                    {transaction.user}
                                </Typography>
                            </Box>
                            <Box color={colors.grey[100]}>{transaction.date}</Box>
                            <Box
                                backgroundColor={colors.teal[500]}
                                p="5px 10px"
                                borderRadius="4px"
                            >
                                ${transaction.cost}
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box
                    borderRadius={2}
                    gridColumn="span 4"
                    gridRow="span 3"
                    backgroundColor={colors.primary[900]}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ padding: "15px 30px 20px 30px" }}
                    >
                        Sales Quantity
                    </Typography>
                    <Box height="280px" mt="-20px"  >
                        <BarChartM />
                    </Box>
                </Box>


                {/* end */}
            </Box>
        </Box >
    )
}

export default Dashboard


