import API from "../../api/api";

const fetchAllEmployees = async (token) => {
    const response = await API.get('/auth/allusers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users; 
};

const fetchTotalWorks = async (token) => {
  const response = await API.get('/total-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchCompletedWorks = async (token) => {
  const response = await API.get('/completed-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchAssignedWorks = async (token) => {
  const response = await API.get('/assigned-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchUnassignedWorks = async (token) => {
  const response = await API.get('/unassigned-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchHoldWorks = async (token) => {
  const response = await API.get('/hold-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchCanceledWorks = async (token) => {
  const response = await API.get('/cancelled-works', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; 
};

const fetchWorkById = async (id, token) => {
  try {
    const response = await API.get(`/getwork/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.work; 
  } catch (error) {
    console.error("Error fetching work:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch work");
  }
};
const updateWork = async (workId, updatedWorkData, token) => {
  try {
    const response = await API.put(`/updatework/${workId}`, updatedWorkData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Work updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating work:", error);
    throw new Error(error.response?.data?.error || "Failed to update work");
  }
};

const deleteWork = async (workId, token) => {
  try {
    const response = await API.delete(`/deletework/${workId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Work deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting work:", error);
    throw new Error(error.response?.data?.error || "Failed to delete work");
  }
};

export {
  fetchTotalWorks,
  fetchCompletedWorks,
  fetchAssignedWorks,
  fetchUnassignedWorks,
  fetchHoldWorks,
  fetchCanceledWorks,
  fetchAllEmployees,
  fetchWorkById,
  deleteWork,
  updateWork
};
