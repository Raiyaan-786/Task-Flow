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
  Grid2,
  Skeleton
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import API from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { tenantLogin, setSelectedTenant } from "../../features/tenantAuthSlice";

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
      {value === index && <Box>{children}</Box>}
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
      backgroundColor: colors.blueHighlight[900],
      color: "white",
    },
  }));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tenant, tenanttoken } = useSelector((state) => state.tenantAuth);
  const selectedTenant = useSelector((state) => state.tenantAuth.selectedTenant);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [saving,setSaving]=useState(false);
  const [logosaving,setLogoSaving]=useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        if (!tenanttoken) {
          navigate("/tenantlogin");
          return;
        }
        setLoading(true);
        const response = await API.get("/tenant/gettenant", {
          headers: { Authorization: `Bearer ${tenanttoken}` },
        });
        console.log(response.data);
        if (response.data.success) {
          const fetchedTenant = response.data.tenant;
          dispatch(tenantLogin({ tenant: fetchedTenant, tenanttoken }));
          dispatch(setSelectedTenant({
            name: fetchedTenant.name || "",
            phone: fetchedTenant.phone || "",
            companyName: fetchedTenant.companyName || "",
            image: fetchedTenant.image || "",
            companyLogo: fetchedTenant.companyLogo || "",
            profileImage: null,
            companyLogoFile: null
          }));
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
  }, [navigate, tenanttoken, dispatch]);

  const isFreePlan = tenant?.plan?.tier?.toLowerCase() === "free";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setSelectedTenant({
          ...selectedTenant,
          profileImage: file,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoChange = (e) => {
   
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setSelectedTenant({
          ...selectedTenant,
          companyLogoFile: file,
          companyLogo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
   
  };

  const handleSubmit = async (e) => {
    setSaving(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", selectedTenant.name);
    formData.append("phone", selectedTenant.phone);
    if (selectedTenant.profileImage) formData.append("image", selectedTenant.profileImage);
    if (!isFreePlan) {
      formData.append("companyName", selectedTenant.companyName);
      if (selectedTenant.companyLogoFile) formData.append("companyLogo", selectedTenant.companyLogoFile);
    }
    try {
      if (!tenanttoken) throw new Error("No authentication token found");
      const response = await API.put(`/tenant/update/${tenant._id}`, formData, {
        headers: { Authorization: `Bearer ${tenanttoken}`, "Content-Type": "multipart/form-data" },
      });
      if (response.data.message === "Tenant updated successfully") {
        setSaving(false);
        alert("Tenant profile updated successfully!");
        const updatedTenant = response.data.tenant;
        dispatch(tenantLogin({ tenant: updatedTenant, tenanttoken }));
        dispatch(setSelectedTenant({
          name: updatedTenant.name || "",
          phone: updatedTenant.phone || "",
          companyName: updatedTenant.companyName || "",
          image: updatedTenant.image || "",
          companyLogo: updatedTenant.companyLogo || "",
          profileImage: null,
          companyLogoFile: null
        }));
      
      } else throw new Error("Failed to update tenant profile");
    } catch (error) {
      console.error("Error updating tenant profile:", error);
      alert("Error updating tenant profile: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCompanyDetailsSubmit = async (e) => {
     setLogoSaving(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("companyName", selectedTenant.companyName);
    if (selectedTenant.companyLogoFile) formData.append("companyLogo", selectedTenant.companyLogoFile);

    try {
      if (!tenanttoken) throw new Error("No authentication token found");
      const response = await API.put(`/tenant/updatecompany/${tenant._id}`, formData, {
        headers: { Authorization: `Bearer ${tenanttoken}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.message === "Tenant company details updated successfully") {
         setLogoSaving(false)
        alert("Company details updated successfully!");
        const updatedTenant = response.data.tenant;
        dispatch(tenantLogin({ tenant: updatedTenant, tenanttoken }));
        dispatch(setSelectedTenant({
          ...selectedTenant,
          companyName: updatedTenant.companyName || "",
          companyLogo: updatedTenant.companyLogo || "",
          companyLogoFile: null
        }));
      } else throw new Error("Failed to update company details");
    } catch (error) {
      console.error("Error updating company details:", error);
      alert("Error updating company details: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    if (tenant) {
      dispatch(setSelectedTenant({
        name: tenant.name || "",
        phone: tenant.phone || "",
        companyName: tenant.companyName || "",
        image: tenant.image || "",
        companyLogo: tenant.companyLogo || "",
        profileImage: null,
        companyLogoFile: null
      }));
    }
  };

  const handleDeleteProfileImage = () => {
    dispatch(setSelectedTenant({
      ...selectedTenant,
      image: null,
      profileImage: null
    }));
  };

  const handleDeleteCompanyLogo = () => {
    dispatch(setSelectedTenant({
      ...selectedTenant,
      companyLogo: null,
      companyLogoFile: null
    }));
  };

  if (loading) return (
    <Box sx={{ p: 3, bgcolor: colors.foreground[100], height: "100vh", overflow: "auto" }}>
      <Box sx={{ height: 335, position: "relative" }}>
        <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 3, mr: 1, ml: 1 }} />
        <Box sx={{ height: 210, top: "110px", position: "absolute", width: "100%", zIndex: 999, display: 'flex' }}>
          <Skeleton variant="circular" width={210} height={210} sx={{ border: "4px solid white", marginLeft: 5 }} />
          <Box sx={{ pl: 2, width: "500px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
          <Box sx={{ mr: 5, width: "500px", display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={60} height={35} />
            <Skeleton variant="rectangular" width={60} height={35} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ ml: 5, mt: 2 }}>
        <Skeleton variant="rectangular" width={300} height={40} />
      </Box>
      <Divider variant="middle" sx={{ mb: 1, mt: 1 }} />
      <Box sx={{ ml: 8, mt: 2 }}>
        <Grid2 container spacing={2} gap={2}>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={6}><Skeleton variant="rectangular" width="100%" height={40} /></Grid2>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={4}><Skeleton variant="circular" width={60} height={60} /></Grid2>
          <Grid2 size={2}><Skeleton variant="rectangular" width={100} height={30} /></Grid2>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={6}><Skeleton variant="rectangular" width="100%" height={40} /></Grid2>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={6}><Skeleton variant="rectangular" width="100%" height={40} /></Grid2>
        </Grid2>
      </Box>
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
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: colors.foreground[100] }}>
      <Box bgcolor={colors.foreground[100]} display="flex" flexDirection="column">
        <Box bgcolor={colors.foreground[100]} sx={{ height: 335, position: "relative" }}>
          <Box sx={{ borderRadius: 2, m: 1, height: 190, backgroundImage: `url("/login_background1.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <Box
            bgcolor="transparent"
            sx={{ height: 210, top: "130px", position: "absolute", width: "100%", zIndex: 999, display: 'flex' }}
          >
            <Avatar
              src={tenant.image}
              alt="Remy Sharp"
              sx={{ width: 200, height: 200, border: "4px solid white", marginLeft: 5 }}
            />
            <Box sx={{ pl: 2, width: "500px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight={700} color="initial">{tenant?.name || "Tenant Name"}</Typography>
              <Typography variant="h6" color={colors.grey[500]}>{tenant?.email || ""}</Typography>
            </Box>
            <Box sx={{ mr: 5, width: "500px", display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" color="primary" sx={{ height: '35px', width: '60px', textTransform: 'none' }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button disabled={saving} className="gradient-button" variant="contained" color="primary" sx={{ height: '35px', width: '60px', bgcolor: colors.blueHighlight[900], textTransform: 'none' }} onClick={handleSubmit}>
                {saving?"Saving...":"Save"}
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
        <Divider variant="middle" sx={{ mb: 1, mt: 1 }} />
        <form onSubmit={handleSubmit}>
          <TabPanel value={tabValue} index={0}>
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
                <TextField
                  value={selectedTenant?.name || ""}
                  size="small"
                  onChange={(e) => dispatch(setSelectedTenant({ ...selectedTenant, name: e.target.value }))}
                  fullWidth
                  margin="normal"
                />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Profile Image</label>
              </Grid2>
              <Grid2 size={4}>
                <Avatar src={selectedTenant?.image || ""} alt="Remy Sharp" sx={{ width: 60, height: 60 }} />
              </Grid2>
              <Grid2 size={2} sx={{ alignItems: 'center', justifyContent: "end", display: 'flex' }}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="profile-image-input" />
                <label htmlFor="profile-image-input">
                  <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" component="span">Update</Button>
                </label>
                <Button sx={{ textTransform: 'none', ml: 1 }} size="small" variant="outlined" onClick={handleDeleteProfileImage}>Delete</Button>
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Phone</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  size="small"
                  value={selectedTenant?.phone || ""}
                  onChange={(e) => dispatch(setSelectedTenant({ ...selectedTenant, phone: e.target.value }))}
                  fullWidth
                  margin="normal"
                />
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
                <TextField
                  size="small"
                  value={selectedTenant?.companyName || ""}
                  onChange={(e) => dispatch(setSelectedTenant({ ...selectedTenant, companyName: e.target.value }))}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: isFreePlan }}
                  sx={{ backgroundColor: isFreePlan ? "#fff" : "inherit" }}
                />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Company Logo</label>
              </Grid2>
              <Grid2 size={4}>
                <Avatar src={selectedTenant?.companyLogo || "/companyPlaceholder.png"} sx={{ width: 60, height: 60 }} />
              </Grid2>
              <Grid2 size={2} sx={{ alignItems: 'center', justifyContent: "end", display: 'flex' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCompanyLogoChange}
                  style={{ display: "none" }}
                  id="company-logo-input"
                  disabled={isFreePlan}
                />
                <label htmlFor="company-logo-input">
                  <Button
                    sx={{ textTransform: 'none' }}
                    size="small"
                    variant="outlined"
                    component="span"
                    disabled={isFreePlan}
                  >
                    Update
                  </Button>
                </label>
                <Button
                  sx={{ textTransform: 'none', ml: 1 }}
                  size="small"
                  variant="outlined"
                  onClick={handleDeleteCompanyLogo}
                  disabled={isFreePlan}
                >
                  Delete
                </Button>
              </Grid2>
              <Grid2 size={4}></Grid2>
              <Grid2 size={6} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ height: '35px', width: '60px', bgcolor: colors.blueHighlight[900], textTransform: 'none' }}
                  onClick={handleCompanyDetailsSubmit}
                  disabled={isFreePlan || logosaving}
                >
                  {logosaving?"Saving...":"Save"}
                </Button>
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
                <TextField size="small" value={tenant?.plan?.tier || ""} fullWidth margin="normal" disabled sx={{ backgroundColor: "#fff" }} />
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