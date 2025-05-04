import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Signup from './pages/authentication/Signup';
import Login from './pages/authentication/Login';
import PrivateRoute from './pages/authentication/PrivateRoute';
import PrivateLayout from './layout/PrivateLayout';
import Invoices from './pages/invoices';
import Dashboard from './pages/dashboard';
import BackendData from './pages/backenddata';
import ConsultantManager from './pages/consultantmanager';
import CustomerManager from './pages/customermanager';
import Employee from './pages/employee';
import WorkManager from './pages/workmanager';
import Report from './pages/report';
import FileManager from './pages/filemanager';
import UsefulLinks from './pages/usefullinks';
import EditWorkPage from './pages/workmanager/EditWorkPage';
import UserProfilePage from './pages/user/UserProfilePage';
import Settings from './pages/user/Settings';
import Chat from './pages/chat';
import Payroll from './pages/payroll';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setSocket } from './features/socketSlice';
import { setOnlineUsers } from './features/chatSlice';
import Home from './landing/Home';
import TenantLogin from './landing/TenantLogin';
// import Tenant from './landing/Tenant';
import TenantLayout from './layout/TenantLayout'
import TenantHome from './pages/tenant/TenantHome';
import TenantDemo from './pages/tenant/TenantDemo';
import TenantProfile from './pages/tenant/TenantProfile';
import TenantPlan from './pages/tenant/TenantPlan';
import TenantSettings from './pages/tenant/TenantSettings';
import TenantPlanConfirm from './pages/tenant/TenantPlanConfirm';
import TenantPayment from './pages/tenant/TenantPayment';
import TenantReceipt from './pages/tenant/TenantReciept';

import OwnerLogin from './landing/OwnerLogin';
import Owner from './landing/Owner';
import OwnerHome from './components/OwnerHome';
import OwnerPayments from './components/OwnerPayments';
import OwnerRequests from './components/OwnerRequests';
import OwnerClients from './components/OwnerClients';
import OwnerClientDetails from './components/OwnerClientDetails';
import OwnerPaymentDetails from './components/OwnerPaymentDetails';



function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user._id && user.tenantId) {
      // Initialize Socket.IO connection with tenantId, userId, and JWT token
      const socketio = io("http://localhost:4000", {
        query: {
          userId: user._id,
          tenantId: user.tenantId, // Include tenantId in the query
        },
        auth: {
          token: localStorage.getItem('token'), // Assuming the JWT token is stored in localStorage
        },
        transports: ['websocket'],
      });

      dispatch(setSocket(socketio));

      // Handle online users event
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Handle connection errors (e.g., authentication failure)
      socketio.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        // Optionally dispatch an action to handle the error in the UI
      });

      // Handle custom error events from the server (e.g., tenant not found)
      socketio.on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
        // Optionally dispatch an action to handle the error in the UI
      });

      // Cleanup on disconnect
      return () => {
        socketio.close();
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([])); // Clear online users on disconnect
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
      dispatch(setOnlineUsers([])); // Clear online users when user logs out
    }
  }, [user, dispatch]); // Re-run effect when user changes (e.g., on login/logout)

  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTenantCollapsed, setIsTenantCollapsed] = useState(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tenantlogin" element={<TenantLogin />} />
            <Route path="/ownerlogin" element={<OwnerLogin />} />

            <Route path="/owner" element={<Owner />} />
            <Route path="/owner/dashboard" element={<OwnerHome />} />
            <Route path="/owner/payment" element={<OwnerPayments />} />
            <Route path="/owner/payment/:paymentId" element={<OwnerPaymentDetails />} />
            <Route path="/owner/request" element={<OwnerRequests />} />
            <Route path="/owner/client" element={<OwnerClients />} />
            <Route path="/owner/client/:id" element={<OwnerClientDetails />} />

              <Route path="/home" element={<Home />} />

            <Route element={<TenantLayout isCollapsed={isTenantCollapsed} setIsCollapsed={setIsTenantCollapsed} />}>
              
              <Route path="/tenant/home" element={<TenantHome/>} />
              <Route path="/tenant/demo" element={<TenantDemo/>} />
              <Route path="/tenant/profile" element={<TenantProfile/>} />
              <Route path="/tenant/plan" element={<TenantPlan />} />
              <Route path="/tenant/settings" element={<TenantSettings />} />
              <Route path="/tenant/transactions" element={<TenantSettings />} />
              <Route path="/tenant/plan-confirmation" element={<TenantPlanConfirm />} />
              <Route path="/tenant/payment" element={<TenantPayment />} />
              <Route path="/tenant/receipt" element={<TenantReceipt />} />
            </Route>

            {/* Private routes only accessed after successful login */}
            <Route element={<PrivateRoute><PrivateLayout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /></PrivateRoute>}>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/workmanager" element={<PrivateRoute><WorkManager /></PrivateRoute>} />
              <Route path="/edit-work/:id" element={<PrivateRoute><EditWorkPage /></PrivateRoute>} />
              <Route path="/customermanager" element={<PrivateRoute><CustomerManager /></PrivateRoute>} />
              <Route path="/consultantmanager" element={<PrivateRoute><ConsultantManager /></PrivateRoute>} />
              <Route path="/employee" element={<PrivateRoute><Employee /></PrivateRoute>} />
              <Route path="/userprofile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
              <Route path="/filemanager" element={<PrivateRoute><FileManager /></PrivateRoute>} />
              <Route path="/usefullinks" element={<PrivateRoute><UsefulLinks /></PrivateRoute>} />
              <Route path="/backenddata" element={<PrivateRoute><BackendData /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
            </Route>
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;