import { Autocomplete, Box, Button, colors, Modal, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { mockDataManagers, mockDataUsers } from "../../data/mockData";
import { useState } from "react";

const Taskform = () => {
    const [open,setOpen]=useState(false);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };
    return (
        <Box m="20px" >
            <Header title="CREATE TASK" subtitle="Create a New Task" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    getOptionLabel,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            p={2}
                            height={'59vh'}
                            overflow={"auto"}
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="text"
                                label="Task"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.task}
                                name="task"
                                error={!!touched.task && !!errors.task}
                                helperText={touched.task && errors.task}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <Autocomplete
                                disablePortal
                                options={mockDataManagers}
                                fullWidth
                                name="manager"
                                getOptionLabel={option => option.label}
                                onBlur={handleBlur}
                                onChange={(e, value) => {
                                    setFieldValue(
                                        "manager",
                                        value !== null ? value.label : initialValues.manager
                                    );
                                }}
                                renderInput={(params) => <TextField
                                    variant="outlined"
                                    {...params}
                                    label="Manager"
                                    name="manager"
                                    error={!!touched.manager && !!errors.manager}
                                    helperText={touched.manager && errors.manager}
                                />}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={12}
                                type="text"
                                placeholder="Provide the description of the task"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 4" }}
                            />

                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button onClick={()=>setOpen(true)} sx={{ backgroundColor: "#cb3cff" }} variant="contained">
                                Create New Task
                            </Button>
                            <Modal
                                open={open}
                                onClose={()=>{setOpen(!open)}}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                sx={{display:"flex",alignItems:"center",justifyContent:'center'}}
                            >
                                <Box display={'flex'} flexDirection={'column'} gap={3} sx={{height:'150px',width:"250px", bgcolor:"white",borderRadius:'15px',p:3}} >
                                    <Typography id="modal-modal-title" variant="h4" component="h2">
                                        Create a New Task ?
                                    </Typography>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={4}>
                                    <Button variant="outlined" onClick={()=>setOpen(false)}>Cancel</Button>
                                    <Button onClick={()=>{handleSubmit(),setOpen(false)}} type="submit" variant="outlined"  >Create</Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    task: yup.string().required("required"),
    manager: yup.string().required("required"),
    description: yup.string().required("required"),
});
const initialValues = {
    task: "",
    manager: "",
    description: "",
};

export default Taskform;