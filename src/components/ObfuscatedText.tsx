'use client'

import { useEffect, useState } from 'react'

export default function ObfuscatedText({ encoded }: { encoded: string }) {
  const [text, setText] = useState('')

  useEffect(() => {
    setText(atob(encoded))
  }, [encoded])

  return <span>{text}</span>
}
