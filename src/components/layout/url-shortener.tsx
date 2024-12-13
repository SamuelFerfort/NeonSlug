"use client"

import { useState } from "react"
import { Input } from "@/src/components/ui/input"
import { Button } from "../ui/button"

export default function URLShortener() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual URL shortening logic
    setShortUrl(`https://neon.link/${Math.random().toString(36).substr(2, 6)}`)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <Input 
          type="url" 
          placeholder="Paste your long URL here" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow text-lg py-6 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-neon-pink focus:border-neon-pink"
        />
        <Button type="submit" size="lg" className="bg-neon-pink hover:bg-neon-pink/90 text-white text-lg py-6 px-8">
          Shrink It!
        </Button>
      </form>
      {shortUrl && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md flex items-center justify-between">
          <p className="text-neon-pink text-lg break-all">{shortUrl}</p>
          <Button 
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            variant="outline" 
            className="ml-4 text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-white"
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  )
}

