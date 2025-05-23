import { useState } from 'react' 
import './App.css'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='main-body'>
      <Header/>
      <Body/>
    </div>
  )
}

export default App
