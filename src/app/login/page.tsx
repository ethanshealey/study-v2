'use client'
import { auth, signInWithEmailAndPassword } from '@/firebase'
import React, { useState } from 'react'
import ErrorCodes from '@/constants/ErrorCodes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import toastTheme from '@/helpers/toastTheme'

const Login = () => {

  const router = useRouter()
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  const handleLogin = async (e: any) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password).then((res) => {
      router.push('/')
    }).catch((err) => {
      if(/auth\/invalid-*/g.test(err.code)) toast.error("Invalid email/password", toastTheme)
    })
  }

  return (
    <div id="login-wrapper">
      <form id="login" onSubmit={handleLogin}>
        <h1 className='title'>Welcome Back</h1>
        <p className="title-sub">Log in using your email below</p>
        <fieldset>
          <label>Email</label>
          <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </fieldset>
        <button type="submit">Login</button>
        <p className="sub">Don't have an account? <Link href="/register">Sign up here</Link></p>
      </form>
    </div>
  )
}

export default Login