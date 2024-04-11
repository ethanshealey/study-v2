'use client'
import React, { useEffect, useState } from 'react'
import { auth, collection, db, getDocs, onAuthStateChanged, query, where } from '@/firebase'
import AuthContext from '@/context/AuthContext'

const Wrapper = ({ children }: any) => {

    const [ user, setUser] = useState<any>()
    const [ isLoading, setIsLoading ] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if(u) {
              const q = query(collection(db, "Users"), where("email", "==", u.email))
              getDocs(q).then((qs: any) => {
                if(qs.docs.length) {
                  const _u = qs.docs[0].data()
                  setUser(_u)
                  setIsLoading(false)
                }
              })
            }
            else {
                setUser(undefined)
                setIsLoading(false)
            }
          })
          return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={user}>
            { children }
        </AuthContext.Provider>
    )
}

export default Wrapper