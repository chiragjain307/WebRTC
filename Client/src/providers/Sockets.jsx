import React, {useMemo, useContext} from 'react'
import { io } from 'socket.io-client'

export const SocketContext = React.createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
    const socket = useMemo(() => io('http://localhost:3001'), []);
    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}