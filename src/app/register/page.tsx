'use client'
import { addDoc, auth, collection, createUserWithEmailAndPassword, db } from '@/firebase'
import React, { useState } from 'react'
import ErrorCodes from '@/constants/ErrorCodes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Register = () => {

    const router = useRouter()
    const [ username, setUsername ] = useState<string>('')
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ confirmPassword, setConfirmPassword ] = useState<string>('')

    const handleLogin = async (e: any) => {
        e.preventDefault()

        if(password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password).then(async (newUser: any) => {
                await addDoc(collection(db, "Users"), {
                    id: newUser.user.uid,
                    email: email,
                    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + username,
                    username: username
                })
                router.push('/')
            }).catch((error: any) => {
                console.error(error.message)
            })
        }
        else {
            // toast
        }

    }
    
    return (
        <div id="login-wrapper">
            <form id="login" onSubmit={handleLogin}>
                <h1 className='title'>Welcome!</h1>
                <p className="title-sub">Register by filling in the info below</p>
                <fieldset>
                    <label>Username</label>
                    <input type="text" placeholder='Choose a username' value={username} onChange={(e) => setUsername(e.target.value)} />
                </fieldset>
                <fieldset>
                    <label>Email</label>
                    <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </fieldset>
                <fieldset>
                    <label>Confirm Password</label>
                    <input type="password" placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </fieldset>
                <button type="submit">Register</button>
                <p className="sub">Already have an account? <Link href="/login">Log In here</Link></p>
            </form>
        </div>
    )
}

export default Register