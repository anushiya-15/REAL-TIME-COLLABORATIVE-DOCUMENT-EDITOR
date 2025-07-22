import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [document, setDocument] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'init') {
          setDocument(message.data);
        } else if (message.type === 'update') {
          setDocument(message.data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setDocument(newContent);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'update', data: newContent }));
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Collaborative document Editor 
        
      </h1>
      <h4>     designed by ANUSHIYA R     </h4>
      <textarea
        value={document}
        onChange={handleChange}
        rows="20"
        cols="80"
      />
    </div>
  );
}

export default App;
