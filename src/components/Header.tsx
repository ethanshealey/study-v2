'use client'
import React, { useContext, useEffect } from 'react'
import UserAvatarMenu from './UserAvatarMenu'
import { FaSearch } from "react-icons/fa";
import SearchBar from './SearchBar';
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

type HeaderType = {
  hideSearch?: boolean
}

const Header = ({ hideSearch }: HeaderType) => {

  const router = useRouter()
  const user = useContext(AuthContext)

  return (
    <header>
        <div id="header-left">
            <h1 onClick={() => router.push('/')}>Study</h1>
            <p>ethanshealey.com</p>
        </div>
        <div id="header-right">
            { !hideSearch && <SearchBar /> }
            { user ? <UserAvatarMenu /> : <Link href={"/login"} id="login-btn">Log In</Link> }
        </div>
    </header>
  )
}

export default Header