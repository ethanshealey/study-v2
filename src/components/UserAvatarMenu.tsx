import AuthContext from '@/context/AuthContext'
import { auth, signOut } from '@/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { FaUser, FaHome, FaPlus, FaSignOutAlt, FaSearch } from "react-icons/fa"

const UserAvatarMenu = () => {

  const router = useRouter()
  const user: any = useContext(AuthContext)
  const [ showDropdown, setShowDropdown ] = useState<boolean>(false)

  const handleSignOut = () => {
    signOut(auth)
    router.push('/')
  }

  const goHome = () => router.push('/')
  
  const goProfile = () => router.push('/profile')

  const goCreate = () => router.push('/set/create')

  const goSearch = () => router.push('/search')

  return (
    <div id="user-avatar-menu">
        <img id="user-avatar" src={user.avatar} onClick={() => setShowDropdown((p: boolean) => !p)} />
        { showDropdown && 
          <div id="menu-dropdown-wrapper">
            <div id="menu-dropdown">
              <button onClick={goHome}><FaHome  /> Home</button>
              <button onClick={goProfile}><FaUser /> Profile</button>
              <button onClick={goSearch}><FaSearch /> Search</button>
              <button onClick={goCreate}><FaPlus /> Create</button>
              <button onClick={handleSignOut} id="sign-out-btn"><FaSignOutAlt /> Sign Out</button>
            </div>
          </div> 
        }
    </div>
  )
}

export default UserAvatarMenu