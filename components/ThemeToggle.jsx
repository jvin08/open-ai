'use client'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false)
  const toggleTheme = () => {
    setIsLight(isLight => !isLight)
  }
  
  useEffect(() => {
    const theme = isLight ? 'cyberpunk' : 'coffee'
    document.documentElement.setAttribute('data-theme', theme)
  },[isLight])
  return (
    <button className='btn btn-outline btn-sm' onClick={toggleTheme}>
      { isLight ? <BsSunFill className='w-4 h-4'/> : <BsMoonFill className='w-4 h-4'/> }
    </button>
  )
}

export default ThemeToggle
