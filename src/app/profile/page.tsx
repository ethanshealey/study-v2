'use client'
import Header from '@/components/Header'
import Spinner from '@/components/Spinner'
import StudySetCard from '@/components/StudySetCard'
import AuthContext from '@/context/AuthContext'
import StudySet from '@/types/StudySet'
import React, { useContext, useEffect, useState } from 'react'

const page = () => {

    const user: any = useContext(AuthContext)
    const [ setCount, setSetCount ] = useState<number>(0)

    const [ isLoadingUserStudySets, setIsLoadingUserStudySets ] = useState<boolean>(false)
    const [ userStudySets, setUserStudySets ] = useState<StudySet[]>([])

    useEffect(() => {
        console.log(user)
        if(user) {
            getUserSetCount()
            getUserSets()
        }
    }, [user])

    const getUserSetCount = async () => {
        const res = await fetch(`/api/v1/sets/count?email=${user?.email}`)
        const data = await res.json()
        setSetCount(data?.count)
    }

    const getUserSets = async () => {
        setIsLoadingUserStudySets(true)
        const res = await fetch(`/api/v1/sets?email=${user?.email}&userOnly=true`)
        const data = await res.json()
        setUserStudySets(data)
        setIsLoadingUserStudySets(false)
    }

    return (
        <main>
            <Header />
            <div id="content">
                <div id="sets">
                    <h1>Profile</h1>
                    <div id="profile-info">
                        <img src={user?.avatar} id="profile-info-avatar" />
                        <h1 id="profile-info-username">{ user?.username }</h1>
                        <p className="profile-stat">Email: {user?.email}</p>
                        <p className="profile-stat">Study Sets created: {setCount}</p>
                    </div>
                    <h1>Your Sets</h1>
                    <div id="set-list">
                    {
                        isLoadingUserStudySets ? (
                        <div className="spinner-wrapper">
                            <Spinner />
                        </div>
                        ) : (
                        userStudySets.map((set: StudySet, idx: number) => (
                            <StudySetCard key={`user-study-set-${idx}`} set={set} />
                        )))
                    }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page