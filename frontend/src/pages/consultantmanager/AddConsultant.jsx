import React, { useState } from "react";
import { Box, Button, Grid2, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import API from "../../api/api";

const AddConsultant = () => {
  const [consultantName, setConsultantName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [signature, setSignature] = useState("");  
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createConsultant = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await API.post("/createconsultant", {
        consultantName: consultantName,
        email: email,
        mobile: mobile,
        address: address,
        username: username,
        bankAccountNumber: bankAccountNumber,
        bankIFSCCode: ifscCode,
        accountHolderName: accountHolderName,
        signature: "signature",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setError("");
      console.log('Consultant created successfully')
    } catch (err) {
        setError(err.response?.data?.error || "Failed to create consultant");
        console.log(error)
      setSuccess("");
    }
  };
  const handleFormSubmit = (values) => {
    createConsultant();
    console.log(values);
  };

  return (
    <Box p={2} m="20px" height={"67vh"} overflow={"auto"}>
      <Formik
        initialValues={{
          consultantName,
          email,
          mobile,
          address,
          username,
          bankAccountNumber,
          ifscCode,
          accountHolderName,
          signature,
        }}
        onSubmit={handleFormSubmit}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box pt={1} sx={{ flexGrow: 1 }}>
              <Grid2 container spacing={2}>
                {/* Consultant Name */}
                <Grid2 item size={4}>
                  <label>Consultant Name</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setConsultantName(e.target.value);
                    }}
                    value={values.consultantName}
                    name="consultantName"
                    error={!!touched.consultantName && !!errors.consultantName}
                    helperText={touched.consultantName && errors.consultantName}
                  />
                </Grid2>

                {/* Email */}
                <Grid2 item size={4}>
                  <label>Email</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setEmail(e.target.value);
                    }}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid2>

                {/* Mobile */}
                <Grid2 item size={4}>
                  <label>Mobile</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setMobile(e.target.value);
                    }}
                    value={values.mobile}
                    name="mobile"
                    error={!!touched.mobile && !!errors.mobile}
                    helperText={touched.mobile && errors.mobile}
                  />
                </Grid2>

                {/* Address */}
                <Grid2 item size={4}>
                  <label>Address</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setAddress(e.target.value);
                    }}
                    value={values.address}
                    name="address"
                    error={!!touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                  />
                </Grid2>

                {/* Username */}
                <Grid2 item size={4}>
                  <label>Username</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setUsername(e.target.value);
                    }}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                  />
                </Grid2>

                {/* Bank Account Number */}
                <Grid2 item size={4}>
                  <label>Bank Account Number</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setBankAccountNumber(e.target.value);
                    }}
                    value={values.bankAccountNumber}
                    name="bankAccountNumber"
                    error={
                      !!touched.bankAccountNumber && !!errors.bankAccountNumber
                    }
                    helperText={
                      touched.bankAccountNumber && errors.bankAccountNumber
                    }
                  />
                </Grid2>

                {/* Bank IFSC Code */}
                <Grid2 item size={4}>
                  <label>Bank IFSC Code</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setIfscCode(e.target.value);
                    }}
                    value={values.ifscCode}
                    name="ifscCode"
                    error={!!touched.ifscCode && !!errors.ifscCode}
                    helperText={touched.ifscCode && errors.ifscCode}
                  />
                </Grid2>

                {/* Account Holder Name */}
                <Grid2 item size={4}>
                  <label>Account Holder Name</label>
                </Grid2>
                <Grid2 item size={8}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setAccountHolderName(e.target.value);
                    }}
                    value={values.accountHolderName}
                    name="accountHolderName"
                    error={
                      !!touched.accountHolderName && !!errors.accountHolderName
                    }
                    helperText={
                      touched.accountHolderName && errors.accountHolderName
                    }
                  />
                </Grid2>

                {/* Signature Upload */}
                <Grid2 item size={4}>
                  <label>Signature</label>
                </Grid2>
                <Grid2 item size={8}>
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

                {/* Submit Button */}
                <Grid2 item>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Box>
                </Grid2>
              </Grid2>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  consultantName: yup.string().required("Consultant Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup.string().required("Mobile is required"),
  address: yup.string().required("Address is required"),
  username: yup.string().required("Username is required"),
  bankAccountNumber: yup.string().required("Bank Account Number is required"),
  ifscCode: yup.string().required("Bank IFSC Code is required"),
  accountHolderName: yup.string().required("Account Holder Name is required"),
  signature: yup
    .mixed()
    .required("Signature is required")
    .test(
      "fileType",
      "Uploaded file is not a JPEG",
      (value) => value && value.type === "image/jpeg"
    ),
});

export default AddConsultant;
