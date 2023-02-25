const defaultCommData = {
  type: 'comm'
}

// Set up a PeerJS instance
const peer = new Peer();
window.peer = peer

// Connect to the signaling server
peer.on('open', () => {
  console.log('Connected to signaling server with ID:', peer.id);
});

// Listen for incoming connections
peer.on('connection', (dataConnection) => {
  console.log('Incoming connection from', dataConnection.peer);

  // Receive data
  dataConnection.on('data', (data) => {
    console.log('Received data:', data);
    if (data.type === 'comm') {
      if (data.payload === 'Hello') {
        console.log('Sending reply to', data.peerId)
        dataConnection.send({
          ...defaultCommData,
          peerId: peer.id,
          replyTo: data.peerId,
          payload: 'World'
        });
      }
    }
  });
});

document.querySelector('#connect').addEventListener('click', () => {
  const peerId = document.querySelector('#peer-id').value;
  const dataConnection = peer.connect(peerId);
  dataConnection.on('open', () => {
    dataConnection.send({
      ...defaultCommData,
      peerId: peer.id,
      payload: 'Hello'
    });
  });
})