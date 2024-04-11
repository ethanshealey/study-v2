import AuthContext from '@/context/AuthContext'
import { auth, signOut } from '@/firebase'
import React, { useContext, useState } from 'react'
import { FaUser, FaHome, FaPlus, FaSignOutAlt } from "react-icons/fa"

const UserAvatarMenu = () => {

  const user: any = useContext(AuthContext)
  const [ showDropdown, setShowDropdown ] = useState<boolean>(false)

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div id="user-avatar-menu">
        <img id="user-avatar" src={user.avatar} onClick={() => setShowDropdown((p: boolean) => !p)} />
        { showDropdown && 
          <div id="menu-dropdown-wrapper">
            <div id="menu-dropdown">
              <button><FaHome  /> Home</button>
              <button><FaUser /> Profile</button>
              <button><FaPlus /> Create</button>
              {/* <hr /> */}
              <button onClick={handleSignOut} id="sign-out-btn"><FaSignOutAlt /> Sign Out</button>
            </div>
          </div> 
        }
    </div>
  )
}

export default UserAvatarMenu