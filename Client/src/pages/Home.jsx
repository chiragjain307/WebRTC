import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../providers/Sockets'

function Home() {
  const {socket} = useSocket();
  const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    console.log(roomId)
    
    const handleRoomJoined = ({roomId}) =>{
      navigate(`/room/${roomId}`)
    }
    useEffect(()=>{
      socket.on('joined-room', handleRoomJoined)
      return () => {
        socket.off('joined-room', handleRoomJoined)
      }
    },[socket, handleRoomJoined])

    const handleJoinRoom = (e) =>{
        e.preventDefault()
        socket.emit('join-room', {emailId: email, roomId});
        // setEmail("");
        // setRoomId("");  
    }
    
  return (
    <div className='home-page w-screen h-screen flex justify-center items-center'>
        <form 
        onSubmit={handleJoinRoom}
        className='flex flex-col text-2xl py-2 px-5 gap-3 border'>
            <input 
            type='email' 
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email id' 
            className='border-black border-2 py-2 px-5'/>
            
            <input 
            type='text'
            value={roomId}
            required
            onChange={(e) => setRoomId(e.target.value)} 
            placeholder='Enter room Id' 
            className='border-black border-2 py-2 px-5' />
            <button className='bg-gray-500' type='submit'>Enter Room</button>
        </form>
    </div>
  )
}

export default Home