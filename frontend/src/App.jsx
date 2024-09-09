import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-16'>
      <h1 className='text-center text-8xl'>Hello, World!</h1>
      <p className='text-2xl'>This uses React, Vite, Tailwind CSS, and Shadcn (JS version)</p>
      <div className='mx-auto w-fit'>
        <Button onClick={() => setCount((count) => count + 1)}>Count is {count}</Button>
      </div>
    </div>
  )
}

export default App
