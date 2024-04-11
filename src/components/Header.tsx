'use client'
import React, { useContext, useEffect } from 'react'
import UserAvatarMenu from './UserAvatarMenu'
import { FaSearch } from "react-icons/fa";
import SearchBar from './SearchBar';
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";

const Header = () => {

  const user = useContext(AuthContext)

  return (
    <header>
        <div id="header-left">
            <h1>Study</h1>
            <p>ethanshealey.com</p>
        </div>
        <div id="header-right">
            <SearchBar />
            { user ? <UserAvatarMenu /> : <Link href={"/login"} id="login-btn">Log In</Link> }
        </div>
    </header>
  )
}

export default Header