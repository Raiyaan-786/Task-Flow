import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid2, Typography, Autocomplete, Modal, Alert, } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { CheckCircle, Cancel } from '@mui/icons-material';

const AddCustomer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false); //for modal opening and closing
  const [firmNames, setFirmNames] = useState([]);
  const [isFieldsDisabled, setFieldsDisabled] = useState(true);
  const [error, setError] = useState("");
  const [panError, setPanError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [panChecked, setPanChecked] = useState(false);
  const [allGroups, setAllGroups] = useState([]); // Add a state for group names

  useEffect(() => {
    const fetchGroupNames = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await API.get("/allgroups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllGroups(response.data.groups || []);
        // console.log(allGroups)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch group names");
      }
    };

    fetchGroupNames();
  }, []);


  useEffect(() => {
    const fetchFirmNames = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await API.get("/companyNames", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFirmNames(response.data.firmNames || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch firm names");
      }
    };

    fetchFirmNames();
  }, []);

  const handleCheckPAN = async (PAN, setFieldValue) => {
    if (!PAN) {
      setError("Please enter a PAN.");
      setFieldsDisabled(true);
      setPanChecked(false);

      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await API.get("/customersPan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { PAN },
      });
      if (response.data.pans.includes(PAN)) {
        setPanError("PAN already exists. Please enter a new PAN.");
        setFieldsDisabled(true);
        setPanChecked(false);
      } else {
        setPanError("");
        setFieldsDisabled(false);
        setPanChecked(true);
        setFieldValue("PAN", PAN);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error checking PAN");
      setFieldsDisabled(true);
      setPanChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    // console.log(values)
    const token = localStorage.getItem("token");
    try {
      const response = await API.post("/createcustomer", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(response.data.message || "Customer created successfully!");
      setError("");
      resetForm();
      setFieldsDisabled(true);
      setPanChecked(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create customer");

      setSuccess("");
    }
    setOpen(true);
  };

  return (
    <Box p={2} m="20px" height="67vh" overflow="auto">
      <Formik
        initialValues={{
          customerName: "",
          customerCode: "",
          billingName: "",
          companyName: "",//
          email: "",
          mobileNo: "",
          whatsappNo: "",
          sameAsMobileNo: false,//
          PAN: "", //
          address: "",
          contactPersonName: "",
          contactPersonPhone: "",
          AadharNo: "", //
          password: "",
          groupName: "",
        }}
        validationSchema={yup.object().shape({
          PAN: yup
            .string()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
            .required("PAN is required"),
          customerName: yup.string().required("Customer Name is required"),
          customerCode: yup.string(),
          billingName: yup.string(),
          companyName: yup.string(),
          email: yup.string().email("Invalid email").required("Email ID is required"),
          mobileNo: yup.string(),
          whatsappNo: yup.string(),
          address: yup.string(),
          contactPersonName: yup.string(),
          contactPersonPhone: yup.string(),
          AadharNo: yup.string(),
          groupName: yup.string(),
        })}
        onSubmit={(values, { resetForm }) => {
          const modifiedValues = {
            ...values,
            password: values.email, // Automatically set password to email
          };
          handleFormSubmit(modifiedValues, { resetForm });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm
        }) => (
          <form onSubmit={handleSubmit}>
            <Box pb={2}>
              {panError ? <Alert severity="error">{panError}</Alert> : undefined}
              <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                {/* PAN */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>PAN NUMBER</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER PAN NUMBER"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={(e) => handleCheckPAN(e.target.value, setFieldValue)}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase();
                      if (uppercaseValue === "") resetForm();
                      else
                        setFieldValue('PAN', uppercaseValue); // Update the Formik value explicitly
                    }}
                    value={values.PAN}
                    name="PAN"
                    error={touched.PAN && !!errors.PAN}
                    helperText={touched.PAN && errors.PAN}
                    slotProps={{
                      htmlInput: {
                        style: {
                          textTransform: 'uppercase', // Capitalize all letters
                        },
                        maxLength: 10, // Setting the maximum number of characters to 10
                      },
                    }}
                  />
                </Grid2>

                {/* Customer Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CUSTOMER NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER CUSTOMER NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerName}
                    name="customerName"
                    disabled={!panChecked}
                    error={touched.customerName && !!errors.customerName}
                    helperText={touched.customerName && errors.customerName}
                  />
                </Grid2>

                {/* Customer Code */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CUSTOMER CODE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER CUSTOMER CODE"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.customerCode}
                    name="customerCode"
                    disabled={!panChecked}
                  />
                </Grid2>
                {/* customer group Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CUSTOMER GROUP</label>
                </Grid2 >
                <Grid2 size={6}>
                  <Autocomplete
                    options={allGroups}  // List of groups fetched from your backend
                    size="small"
                    disabled={!panChecked} // Disabled until PAN is checked
                    freeSolo // Allow free text entry
                    getOptionLabel={(option) => option.groupName || ""} // Ensure it only shows the group name
                    value={values.groupName ? allGroups.find(group => group._id === values.groupName) : null} 
                    onChange={(event, newValue) => {
                      // Set the group _id in Formik value
                      setFieldValue('groupName', newValue ? newValue._id : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ENTER GROUP NAME"
                        variant="filled"
                        onBlur={handleBlur}
                      />
                    )}
                  />
                </Grid2>
                {/* Aadhar Number */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>AADHAAR NUMBER</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER AADHAAR NUMBER"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.AadharNo}
                    name="AadharNo"
                    disabled={!panChecked}
                    error={touched.AadharNo && !!errors.AadharNo}
                    helperText={touched.AadharNo && errors.AadharNo}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }
                    }
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
                    disabled={!panChecked}
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
                    value={values.mobileNo}
                    name="mobileNo"
                    disabled={!panChecked}
                    error={touched.mobileNo && !!errors.mobileNo}
                    helperText={touched.mobileNo && errors.mobileNo}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }
                    }
                  />
                </Grid2>

                {/* WhatsApp Number */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>WHATSAPP NO.</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER WHATSAPP NUMBER"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sameAsMobileNo ? values.mobileNo : values.whatsappNo}
                    name="whatsappNo"
                    disabled={!panChecked || values.sameAsMobileNo}
                    error={touched.whatsappNo && !!errors.whatsappNo}
                    helperText={touched.whatsappNo && errors.whatsappNo}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!panChecked}
                        checked={values.sameAsMobileNo}
                        onChange={(e) =>
                          setFieldValue("sameAsMobileNo", e.target.checked)
                        }
                      />
                    }
                    label="Same as Mobile"
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
                    disabled={!panChecked}
                  />
                </Grid2>

                {/* Billing Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>BILLING NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER BILLING NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.billingName}
                    name="billingName"
                    disabled={!panChecked}
                  />
                </Grid2>
                {/* Company Firm Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>COMPANY/FIRM NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete

                    disablePortal
                    options={firmNames}
                    size="small"
                    disabled={!panChecked}
                    freeSolo // Allow typing any value (free-text entry)
                    value={values.companyName}
                    onChange={(event, newValue) => setFieldValue('companyName', newValue)}
                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="ENTER COMPANY/FIRM NAME" />}
                  />
                </Grid2>

                {/* Contact Person Name */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CONTACT PERSON NAME</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER CONTACT PERSON NAME"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactPersonName}
                    name="contactPersonName"
                    disabled={!panChecked}
                  />
                </Grid2>
                {/* Contact Person Phone */}
                <Grid2 size={6} display={'flex'} alignItems={'center'}>
                  <label>CONTACT PERSON PHONE</label>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    placeholder="ENTER CONTACT PERSON PHONE"
                    size="small"
                    fullWidth
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactPersonPhone}
                    name="contactPersonPhone"
                    disabled={!panChecked}
                    type="number"
                    sx={{
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      },
                    }
                    }
                    error={touched.contactPersonPhone && !!errors.contactPersonPhone}
                    helperText={touched.contactPersonPhone && errors.contactPersonPhone}
                  />
                </Grid2>

                {/* Submit Button */}
                <Grid2 size={2} mt={2}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.blueHighlight[900] }}
                    fullWidth
                    type="submit"
                    disabled={isFieldsDisabled || loading}
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
    </Box>
  );
};

export default AddCustomer;
