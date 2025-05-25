import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  Tabs,
  Tab,
  styled,
  Grid2
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import API from "../../api/api";
import profilebg from '../../../public/profilebg.jpeg';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box >{children}</Box>}
    </div>
  );
};

const TenantProfilePage = () => {
  const RoundedTabs = styled(Tabs)({
    padding: "10px",
    minHeight: "40px",
    "& .MuiTabs-indicator": {
      display: "none",
    },
  });

  const RoundedTab = styled(Tab)(({ theme }) => ({

    marginRight: "5px",
    textTransform: "none",
    fontWeight: 400,
    borderRadius: "10px",
    minHeight: "35px",
    padding: "0px 10px",
    color: "obsidian",
    "&.Mui-selected": {
      // backgroundColor: colors.blueHighlight[900],
       background: "linear-gradient(to right, #2563eb, #7c3aed)",
      color: "white",
    },
  }));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [companyLogoPreview, setCompanyLogoPreview] = useState("");

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenanttoken = localStorage.getItem("tenanttoken");
        if (!tenanttoken) {
          navigate("/tenantlogin");
          return;
        }
        const response = await API.get("/tenant/gettenant", {
          headers: { Authorization: `Bearer ${tenanttoken}` },
        });
        console.log(response.data)
        if (response.data.success) {
          const fetchedTenant = response.data.tenant;
          setTenant(fetchedTenant);
          setName(fetchedTenant.name || "");
          setPhone(fetchedTenant.phone || "");
          setCompanyName(fetchedTenant.companyName || "");
          setImagePreview(fetchedTenant.image || "");
          setCompanyLogoPreview(fetchedTenant.companyLogo || "");
        } else throw new Error("Failed to fetch tenant data");
      } catch (err) {
        console.error("Error fetching tenant:", err);
        setError(err.response?.data?.error || "Failed to fetch tenant data");
        if (err.response?.status === 401 || err.response?.status === 403) navigate("/tenantlogin");
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [navigate]);

  const isFreePlan = tenant?.plan?.tier?.toLowerCase() === "free";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setCompanyLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profileImage) formData.append("image", profileImage);
    if (!isFreePlan) {
      formData.append("companyName", companyName);
      if (companyLogo) formData.append("companyLogo", companyLogo);
    }
    try {
      const tenanttoken = localStorage.getItem("tenanttoken");
      if (!tenanttoken) throw new Error("No authentication token found");
      const response = await API.put(`/tenant/update/${tenant._id}`, formData, {
        headers: { Authorization: `Bearer ${tenanttoken}`, "Content-Type": "multipart/form-data" },
      });
      if (response.data.message === "Tenant updated successfully") {
        alert("Tenant profile updated successfully!");
        const updatedTenant = response.data.tenant;
        setTenant(updatedTenant);
        setName(updatedTenant.name || "");
        setPhone(updatedTenant.phone || "");
        setCompanyName(updatedTenant.companyName || "");
        setImagePreview(updatedTenant.image || "");
        setCompanyLogoPreview(updatedTenant.companyLogo || "");
        setProfileImage(null);
        setCompanyLogo(null);
      } else throw new Error("Failed to update tenant profile");
    } catch (error) {
      console.error("Error updating tenant profile:", error);
      alert("Error updating tenant profile: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    if (tenant) {
      setName(tenant.name || "");
      setPhone(tenant.phone || "");
      setCompanyName(tenant.companyName || "");
      setImagePreview(tenant.image || "");
      setCompanyLogoPreview(tenant.companyLogo || "");
      setProfileImage(null);
      setCompanyLogo(null);
    }
  };

  const handleDeleteProfileImage = () => {
    setImagePreview(null);
    setProfileImage(null);
  };

  const handleDeleteCompanyLogo = () => {
    setCompanyLogoPreview(null);
    setCompanyLogo(null);
  };

  if (loading) return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Tenant Profile</Typography>
      <Typography>Loading...</Typography>
    </Box>
  );
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Tenant Profile</Typography>
      <Typography color="error">{error}</Typography>
    </Box>
  );
  if (!tenant) return null;

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  return (
    <Box sx={{ height: "100vh", overflow: "auto" ,bgcolor: colors.foreground[100]}}>
      <Box bgcolor={colors.foreground[100]} display="flex" flexDirection="column">
        <Box bgcolor={colors.foreground[100]} sx={{ height: 335, position: "relative"}}>
          <Box sx={{borderRadius:3,mr:1,ml:1, height: 180, backgroundImage: `url("/login_background1.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', }} />
          {/* <Box sx={{borderBottomLeftRadius:30,borderBottomRightRadius:30, height: 180, backgroundImage: `url(${profilebg})`, backgroundSize: 'cover', backgroundPosition: 'center', }} /> */}
          <Box
            bgcolor="transparent"
            sx={{ height: 210, top: "110px", position: "absolute", width: "100%", zIndex: 999, display: 'flex' }}
          >
            <Avatar
              src={imagePreview}
              alt="Remy Sharp"
              sx={{ width: 210, height: 210, border: "4px solid white", marginLeft: 5 }}
            />
            <Box sx={{ pl: 2, width: "500px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight={700} color="initial">{name}</Typography>
              <Typography variant="h6" color={colors.grey[500]}>{tenant?.email || ""}</Typography>
            </Box>
            <Box sx={{ mr:5, width: "500px", display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
              <Button  variant="outlined" color="primary" sx={{ height: '35px', width: '60px',textTransform:'none' }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="gradient-button" variant="contained" color="primary" sx={{ height: '35px', width: '60px', bgcolor: colors.blueHighlight[900] ,textTransform:'none'}} onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
        <RoundedTabs value={tabValue} onChange={handleTabChange} sx={{ ml: 5 }}>
          <RoundedTab label="Basic Info" />
          <RoundedTab label="Company Info" />
          <RoundedTab label="Plan Info" />
          <RoundedTab label="Login Credentials" />
          <RoundedTab label="Features" />
        </RoundedTabs>
        <Divider variant="middle" sx={{mb:1,mt:1}} />
        <form onSubmit={handleSubmit}>
          <TabPanel value={tabValue} index={0} >
            <Grid2
              container
              spacing={2}
              gap={2}
              color={colors.grey[200]}
              ml={8}
              
            >
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Name</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField value={name} size="small" onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Profile Image</label>
              </Grid2>
              <Grid2 size={4}>
                <Avatar src={imagePreview } alt="Remy Sharp" sx={{ width: 60, height: 60 }} />
              </Grid2>
              <Grid2 size={2}  sx={{alignItems:'center',justifyContent:"end",display:'flex'}}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="profile-image-input" />
                <label htmlFor="profile-image-input">
                  <Button sx={{textTransform:'none'}} size="small" variant="outlined" component="span">Update</Button>
                </label>
                <Button sx={{textTransform:'none', ml: 1 }} size="small" variant="outlined"  onClick={handleDeleteProfileImage} >Delete</Button>
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Phone</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Email</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={tenant?.email || ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid2
              container
              spacing={2}
              gap={2}
              color={colors.grey[200]}
              ml={8}
            >
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Company Name</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={companyName} onChange={(e) => setCompanyName(e.target.value)} fullWidth margin="normal" InputProps={{ readOnly: isFreePlan }} sx={{ backgroundColor: isFreePlan ? "#fff" : "inherit" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Company Logo</label>
              </Grid2>
              <Grid2 size={4}>
                <Avatar src={companyLogoPreview } alt="./companyPlaceholder.png" sx={{ width: 60, height: 60 }} />
              </Grid2>
              <Grid2 size={2}  sx={{alignItems:'center',justifyContent:"end",display:'flex'}}>
                <input type="file" accept="image/*" onChange={handleCompanyLogoChange} style={{ display: "none" }} id="company-logo-input" disabled={isFreePlan} />
                <label htmlFor="company-logo-input">
                  <Button sx={{textTransform:'none'}} size="small" variant="outlined" component="span" disabled={isFreePlan}>Update</Button>
                </label>
                <Button sx={{textTransform:'none',ml: 1}} size="small" variant="outlined"  onClick={handleDeleteCompanyLogo}  disabled={isFreePlan}>Delete</Button>
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Grid2
              container
              spacing={2}
              gap={1}
              color={colors.grey[200]}
              ml={8}
            >
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Subscription Plan</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small"  value={tenant?.plan?.tier || ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Start Date</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={tenant?.plan?.startsAt ? new Date(tenant.plan.startsAt).toLocaleDateString() : ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Renewal Date</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={tenant?.plan?.renewsAt ? new Date(tenant.plan.renewsAt).toLocaleDateString() : ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h5" gutterBottom>Billing Information</Typography>
            <TextField label="Address Line 1" value={tenant?.billing?.billingAddress?.line1 || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="City" value={tenant?.billing?.billingAddress?.city || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="State" value={tenant?.billing?.billingAddress?.state || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="Postal Code" value={tenant?.billing?.billingAddress?.postalCode || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="Country" value={tenant?.billing?.billingAddress?.country || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="Next Billing Date" value={tenant?.billing?.nextBillingDate ? new Date(tenant.billing.nextBillingDate).toLocaleDateString() : ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
            <TextField label="Invoice Email" value={tenant?.billing?.invoiceEmail || ""} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ backgroundColor: "#fff" }} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Grid2
              container
              spacing={2}
              gap={1}
              color={colors.grey[200]}
             ml={8}
            >
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Username</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={tenant?.loginCredentials?.username || ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Password</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField size="small" value={tenant?.loginCredentials?.password || ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
              <Grid2
              container
              spacing={2}
              gap={1}
              color={colors.grey[200]}
             ml={8}
            >
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Can Export</label>
              </Grid2>
               <Grid2 size={6}>
                <TextField size="small" value={tenant?.features?.canExport ? "Yes" : "No"} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>API Access</label>
              </Grid2>
               <Grid2 size={6}>
                <TextField size="small" value={tenant?.features?.apiAccess ? "Yes" : "No"} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Priority Support</label>
              </Grid2>
               <Grid2 size={6}>
                <TextField size="small" value={tenant?.features?.prioritySupport ? "Yes" : "No"} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Custom Domain</label>
              </Grid2>
               <Grid2 size={6}>
                <TextField size="small" value={tenant?.features?.customDomain ? "Yes" : "No"} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
              </Grid2>
            </Grid2>
          </TabPanel>
        </form>
      </Box>
    </Box>
  );
};

export default TenantProfilePage;