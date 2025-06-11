import React, { useEffect, useState } from 'react'
import { get } from '@vercel/edge-config'

const WelcomePage = () => {
  const [greeting, setGreeting] = useState<string | undefined>()

  useEffect(() => {
    get<string>('greeting').then(setGreeting).catch(() => setGreeting('Hello'))
  }, [])

  return <div>{greeting ?? 'Loading...'}</div>
}

export default WelcomePage
