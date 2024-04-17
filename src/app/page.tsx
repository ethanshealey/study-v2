'use client'
import Header from "@/components/Header";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import StudySet from "@/types/StudySet";
import StudySetCard from "@/components/StudySetCard";
import Spinner from "@/components/Spinner";

export default function Home() {

  const user: any = useContext(AuthContext)

  const [ isLoadingUserStudySets, setIsLoadingUserStudySets ] = useState<boolean>(false)
  const [ userStudySets, setUserStudySets ] = useState<StudySet[]>([])

  const [ isLoadingStudySets, setIsLoadingStudySets ] = useState<boolean>(false)
  const [ studySets, setStudySets ] = useState<StudySet[]>([])

  useEffect(() => {
    if(user) {
      loadStudySets()
      loadUserOnlyStudySets()
    }
  }, [user])

  const loadUserOnlyStudySets = async () => {
    setIsLoadingUserStudySets(true)
    const res = await fetch(`/api/v1/sets?email=${user?.email}&userOnly=true`)
    const data = await res.json()
    setUserStudySets(data)
    setIsLoadingUserStudySets(false)
  }

  const loadStudySets = async () => {
    setIsLoadingStudySets(true)
    const res = await fetch(`/api/v1/sets?email=${user?.email}`)
    const data = await res.json()
    setStudySets(data)
    setIsLoadingStudySets(false)
  }

  return (
    <main>
      <Header />
      <div id="content">
        <div id="sets">
          { user && (
          <>
            <h1>Your Study Sets</h1>
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
          </>
          )}  
          <h1>All Study Sets</h1>
            <div id="set-list">
              {
                isLoadingStudySets ? (
                <div className="spinner-wrapper">
                  <Spinner />
                </div>
                ) : (
                studySets.map((set: StudySet, idx: number) => (
                  <StudySetCard key={`study-set-${idx}`} set={set} />
                )))
              }
            </div>
        </div>
      </div>
    </main>
  )
}
