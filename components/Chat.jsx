'use client';
import { generateChatResponse } from '@/utils/actions';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) =>  generateChatResponse([...messages, query]),
    onSuccess: (data) => {
      if(!data){
        toast.error('Something went wrong...');
        setText('')
        return;
      }
      setMessages(prev => [...prev, data])
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {role: 'user', content: text}
    mutate(query);
    setMessages((prev) => [...prev, query]);
    setText('');
  }
  // console.log(messages)
  return (
    <div className='w-full min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
      <div>
        {messages.map(({role, content}, index)=>{
          const avatar = role === 'user' ? '🐺' : '🤖';
          const bcg = role === 'user' ? 'bg-base-200' : 'bg-base-100';
          return <div key={index} className={`${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}>
            <span className='mr-4'>{avatar}</span>
            <p className='max-w-3xl'>{content}</p>
          </div>
        })}
      </div>
      <form onSubmit={handleSubmit} className='min-w-4xl pt-12 mt-auto'>
        <div className='join w-full'>
          <input 
            type='text' 
            className="input input-bordered join-item w-full" 
            placeholder="Message GeniusGPT" 
            required
            onChange={(e) => setText(e.target.value)}  
            value={text || ''}
          />
          <button 
            className="btn btn-primary join-item rounded-r-lg uppercase mr-32" 
            type='submit'
            disabled={isPending}
          >{isPending ? 'please wait...' : 'ask question'}</button>
        </div>
      </form>
    </div>
  )
}

export default Chat
