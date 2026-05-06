import { Outlet } from 'react-router-dom'
import Header from './Header'
import NavBar from './NavBar'

const Default = () => {
  return (
    <div>
        <Header />
        <NavBar />
        <Outlet />
    </div>
  )
}

export default Default