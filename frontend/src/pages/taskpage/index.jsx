import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import {useParams} from "react-router-dom"
import {mockDataTasks} from "../../data/mockData"

const Taskpage = () => {
    // const param=useParams();
    const param = useParams();


  return (
    <Box p={2} m='20px'>
       <Header title={"TASK PAGE"} subtitle={'view the task'}/>
       <Box bgcolor={'grey'} height={'65vh'} overflow={'auto'}>
           {param.taskid}
          
           
       </Box>
    </Box>
  )
}

export default Taskpage