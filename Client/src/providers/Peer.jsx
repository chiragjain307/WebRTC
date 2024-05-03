import React, {useContext, useEffect, useMemo, useState} from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState(null)

    //RTC Peer Connection is a WebRTC API that allows you to create a connection between two peers. It is used to send and receive audio and video streams, as well as arbitrary data between peers.
    // it is a pre defined class in webRTC API
    // it goes to turn server and gets the public information of the peer
    // it will provide its public information to peer
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.google.com:3478"
                ]
                // we are saying that we are going to use google's stun server and twilio stun server to get the public information of the peer
                // they are free
            }
        ]
    }), []);
    
    // this function will create an offer to the peer and set the local description of the peer to the offer that we created and return the offer to the peer so that it can send it to the other peer to establish a connection between them.
    // this function is asynchronous because it will take some time to create the offer
    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }
    
    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    const setRemoteAns = async (ans) =>{
        await peer.setRemoteDescription(ans)
    }

    const sendStream = (stream) => {
        const tracks = stream.getTracks();
        tracks.forEach((track) => peer.addTrack(track, stream));
    }


    const handleTrack = (event) =>{
        console.log('Remote Stream: ', event);
        setRemoteStream(event.streams[0]);
    }

    useEffect(() => {
        peer.ontrack = handleTrack;
        return () => {
            peer.ontrack = null;
        }
    }, [peer])
    
    // this peer contains my information
    return (
        <PeerContext.Provider value={{peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream}}> 
            {children}
        </PeerContext.Provider>
    )
}