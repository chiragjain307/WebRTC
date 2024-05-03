import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SocketProvider } from './providers/Sockets'
import { PeerProvider } from './providers/Peer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import Room from './pages/Room'

function App() {

  return (
    <>
      <SocketProvider>
        <PeerProvider>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room/>} />

        </Routes>
        </PeerProvider>
      </SocketProvider>
    </>
  )
}

export default App
