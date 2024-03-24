import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v1 as uuidv1 } from 'uuid';

const socket = io('http://localhost:4000');

interface Message {
  id: any,
  text: string,
  author: string,
  timestamp: Date,
}

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      sendMessage('system', 'Se ha conectado ' + socket.id?.toString());
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  function sendMessage(author: string, text: string) {
    const msg: Message = {
      id: uuidv1(),
      text: text,
      author: author,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, msg]);
  }

  return (
    <main className="flex flex-col h-screen justify-center p-5">
      <section className='flex flex-col h-full w-full space-y-4 rounded-md p-4 border border-1 border-gray-300 overflow-scroll no-scrollbar'>
        {messages.map(function (msg: Message) {
          return (
            msg.author != 'system' ?
              <div key={msg.id} className='flex flex-row space-x-2'>
                <img src='https://media1.tenor.com/m/x5eWIvHg1yYAAAAC/sad-hamster-hampter.png' className='w-12 rounded-full' />
                <div>
                  <span className='font-bold'>{msg.author} </span><span className='ml-1 font-normal text-sm text-gray-400'>{msg.timestamp.toLocaleTimeString()}</span>
                  <div>
                    {msg.text}
                  </div>
                </div>
              </div>
              :
              <div key={msg.id} className='flex flex-row text-gray-400 italic'>
                {msg.text}
              </div>
          )
        })}
      </section>
      <div className='flex w-full h-14 mt-2'>
        <input value={currentMessage}
          placeholder='Write a message'
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage(socket.id || '', currentMessage);
              setCurrentMessage('');
            }
          }}
          className='w-full pl-4 rounded-md border border-1 border-gray-300' />
        <button className='px-5 text-black hover:text-gray-500'
          onClick={() => {
            sendMessage(socket.id || '', currentMessage);
            setCurrentMessage('');
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </main>
  );
}