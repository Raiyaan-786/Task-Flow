import React, { useState } from "react";
import { Box, Button, Grid2, Modal, TextField, Typography ,Autocomplete} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CheckCircle, Cancel } from '@mui/icons-material';

const AddConsultant = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false); //for modal opening and closing
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('consultantName', values.consultantName);
    formData.append('email', values.email);
    formData.append('mobile', values.mobile);
    formData.append('address', values.address);
    formData.append('username', values.username);
    formData.append('bankAccountNumber', values.bankAccountNumber);
    formData.append('bankIFSCCode', values.bankIFSCCode);
    formData.append('accountHolderName', values.accountHolderName);
    
    if (values.signature) {
      formData.append('signature', values.signature);
    }

    try {
      setLoading(true);
      const response = await API.post('/createconsultant', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      });
      setSuccess(response.data.message || "Consultant created successfully!");
      setError("");
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create Consultant');
      setSuccess("");
    }
    setOpen(true);
    setLoading(false);
  };


  return (
    <Box p={2} m="20px" height={"67vh"} overflow={"auto"}>
      <Formik
        initialValues={{
          consultantName: '',
          email: '',
          mobile: '',
          address: '',
          username: '',
          bankAccountNumber: '',
          bankIFSCCode: '',
          accountHolderName: '',
          signature: '',
        }}
        validationSchema={yup.object().shape({
          consultantName: yup.string().required("Consultant Name is required"),
          email: yup.string().email("Invalid email").required("Email is required"),
          mobile: yup.string().required("Mobile is required"),
          address: yup.string().required("Address is required"),
          username: yup.string().required("Username is required"),
          bankAccountNumber: yup.string().required("Bank Account Number is required"),
          bankIFSCCode: yup.string().required("Bank IFSC Code is required"),
          accountHolderName: yup.string().required("Account Holder Name is required"),
          signature: yup
            .mixed()
            .required("Signature is required")
            .test(
              "fileType",
              "Uploaded file is not a JPEG",
              (value) => value && value.type === "image/jpeg"
            ),
        })}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box pb={2}>
              <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                {/* Consultant Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CONSULTANT NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER CONSULTANT NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.consultantName}
                    name="consultantName"
                    error={!!touched.consultantName && !!errors.consultantName}
                    helperText={touched.consultantName && errors.consultantName}
                  />
                </Grid2>
                {/* Username */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>USERNAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER USERNAME'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    autoComplete="new-username"
                  />
                </Grid2>
                {/* Email */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>EMAIL</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER EMAIL ID'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid2>

                {/* Mobile */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>MOBILE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER MOBILE NUMBER'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mobile}
                    name="mobile"
                    error={touched.mobile && !!errors.mobile}
                    helperText={touched.mobile && errors.mobile}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }}
                  />
                </Grid2>

                {/* Address */}
                <Grid2 size={6} >
                  <label>ADDRESS</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    multiline
                    minRows={3}
                    maxRows={3}
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    name="address"
                    error={touched.address && !!errors.address}
                    helperText={touched.address && errors.address}

                  />
                </Grid2>

                {/* Bank Account Number  */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>BANK ACCOUNT NUMBER</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder='ENTER BANK ACCOUNT NUMBER'
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.bankAccountNumber}
                    name="bankAccountNumber"
                    error={touched.bankAccountNumber && !!errors.bankAccountNumber}
                    helperText={touched.bankAccountNumber && errors.bankAccountNumber}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }}
                  />
                </Grid2>
                {/* BANK ifsc code */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>BANK IFSC CODE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER BANK IFSC CODE"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.bankIFSCCode}
                    name="bankIFSCCode"
                    error={touched.bankIFSCCode && !!errors.bankIFSCCode}
                    helperText={touched.bankIFSCCode && errors.bankIFSCCode}
                    slotProps={{
                      htmlInput: {
                        style: {
                          textTransform: 'uppercase', // Capitalize all letters
                        },
                        maxLength: 11, // Setting the maximum number of characters to 10
                      },
                    }}
                  />
                </Grid2>

                {/* Account holder name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>ACCOUNT HOLDER NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER ACCOUNT HOLDER NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.accountHolderName}
                    name="accountHolderName"
                    error={touched.accountHolderName && !!errors.accountHolderName}
                    helperText={touched.accountHolderName && errors.accountHolderName}
                  />
                </Grid2>

                {/* Signature Upload */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>SIGNATURE</label>
                </Grid2>
                <Grid2 size={6}>
                  <input
                    type="file"
                    accept="image/jpeg"
                    onChange={(event) => {
                      // handleChange(e);
                      setFieldValue("signature", event.currentTarget.files[0]);
                      setSignature(event.target.files);
                    }}
                    onBlur={handleBlur}
                    style={{ width: "100%" }}
                  />
                  {touched.signature && errors.signature && (
                    <div style={{ color: "red" }}>{errors.signature}</div>
                  )}
                </Grid2>

                {/* submit button */}
                <Grid2 size={2} mt={2}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.teal[300] }}
                    fullWidth
                    type="submit"
                  // disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Grid2>
                <Modal
                  disableAutoFocus
                  open={open}
                  onClose={() => { setOpen(false) }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Box sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '220px', width: '300px', bgcolor: 'white', borderRadius: '15px', padding: '25px'
                  }}>
                    {error ? (
                      <>
                        <Cancel color="error" sx={{ height: '80px', width: '80px' }} />
                        <Typography variant="h2" fontWeight={500} color="error">Error!</Typography>
                        <Typography variant="h5" mb={1} color={colors.grey[500]}>{error}</Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircle color="success" sx={{ height: '80px', width: '80px' }} />
                        <Typography variant="h2" fontWeight={500} color="initial">Success</Typography>
                        <Typography variant="h5" mb={1} color={colors.grey[500]}>{success}</Typography>
                      </>
                    )}

                    <Button sx={{ borderRadius: 5 }} color={error ? "error" : "success"} variant="contained" fullWidth onClick={() => setOpen(false)}>
                      OK
                    </Button>

                  </Box>
                </Modal>
              </Grid2>
            </Box>
          </form>
        )}
      </Formik>
    </Box >
  );
};

export default AddConsultant;
