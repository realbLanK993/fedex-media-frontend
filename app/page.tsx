'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState<string | undefined>("")
  const [link, setLink] = useState<string | undefined>("")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/hello')
      const { message, link } = await res.json()
      setMessage(message)
      setLink(link)
    }
    fetchData()
  }, [])

  if (!message) return <p>Loading...</p>

  return <div className='flex flex-col gap-4 items-center justify-center h-[calc(100vh-220px)]'>
    <p>{message}</p>
    <Link href={link!}>
    <Button>
    Go to dashboard
    </Button>
    </Link>
  </div>
}
