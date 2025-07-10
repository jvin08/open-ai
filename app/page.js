import React from 'react'
import Link from 'next/link'

const HomePage = () => {
  return (
    <div className='hero min-h-screen bg-base-200'> 
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-6xl font-bold text-primary'>GPT Genius</h1>
          <p className='py-6 text-large leading-loose'>GPT Genius is an innovative app designed to harness the power of AI for intelligent conversations, quick problem-solving, and creative assistance.</p>
          <Link href='/portfolio' className='btn btn-secondary'>Get Started</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
