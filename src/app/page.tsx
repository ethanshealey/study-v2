'use client'
import Header from "@/components/Header";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import StudySet from "@/types/StudySet";
import StudySetCard from "@/components/StudySetCard";

export default function Home() {

  const user: any = useContext(AuthContext)
  const [ studySets, setStudySets ] = useState<StudySet[]>([])

  useEffect(() => {
    if(user) {
      loadStudySets()
    }
  }, [user])

  const loadStudySets = async () => {
    const res = await fetch(`/api/v1/sets?email=${user?.email}`)
    const data = await res.json()
    console.log(data)
    setStudySets(data)
  }

  return (
    <main>
      <Header />
      <div id="content">
        <div id="sets">
          <h1>Study Sets</h1>
          <div id="set-list">
            {
              studySets.map((set: StudySet, idx: number) => (
                <StudySetCard key={`study-set-${idx}`} set={set} />
              ))
            }
          </div>
        </div>
      </div>
    </main>
  )
}
