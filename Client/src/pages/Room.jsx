import React, { useEffect, useState } from 'react'
import { useSocket } from '../providers/Sockets'
import { usePeer } from '../providers/Peer'
import ReactPlayer from 'react-player'

function Room({roomId}) {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
  const [myStream, setMyStream] = useState(null)
  const [remoteEmailId, setRemoteEmailId] = useState(null)


  const handleNewUserJoined = async (data) => {
    console.log('New user joined: ', data)
    const { emailId } = data;
    console.log("New user joined: ", emailId);
    const offer = await createOffer();
    socket.emit('call-user', { emailId, offer })
    setRemoteEmailId(emailId)
  }

  const handleIncommingCall = async (data) => {
    const { from, offer } = data
    console.log('Incomming call from: ', from, offer)
    const ans = await createAnswer(offer)
    socket.emit('call-accepted', { emailId: from, ans })
    setRemoteEmailId(from)
  }

  const handleCallAccepted = async (data) => {
    const { ans } = data
    console.log('Call accepted: ', ans)
    await setRemoteAns(ans)

  }

  const getUserStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    console.log(navigator)
    setMyStream(stream)
  }

  const handleNegotiation = async () => {
    try {
      const localOffer = await peer.createOffer();
      await peer.setLocalDescription(localOffer);
      console.log('Negotiation needed');
      socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleSendStream = async () => {
    try {
      await sendStream(myStream);
      // Trigger negotiation after sending the stream
      handleNegotiation();
    } catch (error) {
      console.error('Error sending stream:', error);
    }
  };

  useEffect(() => {
    getUserStream()
  }, [])

  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined)
    socket.on('incomming-call', handleIncommingCall)
    socket.on('call-accepted', handleCallAccepted)

    return () => {
      socket.off('user-joined', handleNewUserJoined)
      socket.off('incomming-call', handleIncommingCall)
      socket.off('call-accepted', handleCallAccepted)
    }
  }, [socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted])
  
  return (
    <div>
      <h1>Room: {roomId }</h1>
      <h4>You are connected to: {remoteEmailId}</h4>
      <button onClick={handleSendStream} className='bg-gray-500'>Send my Stream</button>
      <br />
      <h1>My Stream</h1>
      <ReactPlayer className='scale-x-[-1]' url={myStream} playing muted height={300} />
      <br />
      <h1>Remote Video</h1>
      <ReactPlayer url={remoteStream} playing muted height={300} />

    </div>

  )
}

export default Room