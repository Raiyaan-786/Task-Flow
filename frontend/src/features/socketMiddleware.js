import { io } from "socket.io-client";
import { setSocket, setOnlineUsers } from "../features/authSlice";

const BASE_URL = "http://localhost:4000" ;

const socketMiddleware = (store) => (next) => (action) => {
  const { auth } = store.getState();

  switch (action.type) {
    case "auth/login":
      if (auth.user && !auth.socket) {
        const socket = io(BASE_URL, {
          query: { userId: auth.user._id },
        });

        socket.on("GetOnlineUsers", (userIds) => {
          store.dispatch(setOnlineUsers(userIds));
        });

        store.dispatch(setSocket(socket));
      }
      break;

    case "auth/logout":
      if (auth.socket) {
        auth.socket.disconnect();
        store.dispatch(setSocket(null));
      }
      break;

    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;