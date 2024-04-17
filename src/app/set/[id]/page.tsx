'use client'
import FlashCards from '@/components/FlashCards'
import Header from '@/components/Header'
import AuthContext from '@/context/AuthContext'
import StudySet from '@/types/StudySet'
import Quiz from '@/components/Quiz'
import React, { useContext, useEffect, useState } from 'react'
import UserCard from '@/components/UserCard'
import shuffle from '@/helpers/shuffle'
import { useSearchParams } from 'next/navigation'

type SetPageType = {
  params: any
}

const page = ({ params }: SetPageType) => {

  const user: any = useContext(AuthContext)
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [ studySet, setStudySet ] = useState<StudySet>()
  const [ studyType, setStudyType ] = useState<'cards' | 'quiz'>('cards')
  const [ isLoadingStudySet, setIsLoadingStudySet ] = useState<boolean>(true)

  useEffect(() => {
    if(type === 'cards' || type === 'quiz') setStudyType(type)
    else setStudyType('cards')
    getStudySet()
  }, [user])

  useEffect(() => {
    window.history.pushState(null, "", `?type=${studyType}`)
  }, [studyType])

  const getStudySet = async () => {
    setIsLoadingStudySet(true)
    const res = await fetch(`/api/v1/sets?email=${user?.email ?? ''}&id=${params.id}`)
    const data = await res.json()
    if(data.length > 0)
      setStudySet(data[0])
    setIsLoadingStudySet(false)
  }

  const shuffleDeck = () => {
    const copy = studySet
    copy!.items = shuffle(copy?.items ?? [])
    setStudySet(copy)
  }

  return (
    <main>
      <Header />
      <div id="content">
        { isLoadingStudySet ? (<></>) : (
          <>
            <h3 id="set-title">{ studySet?.title }</h3>
            <div id="set-created-by">Created by &nbsp;<UserCard username={studySet?.createdBy ?? ''} email={studySet?.createdByEmail ?? ''} /></div>
            <div id="set-content-wrapper">
              <div id="study-type-switch">
                <div className={`type-radio type-radio--cards ${ studyType === 'cards' ? 'type-radio-active' : '' }`} onClick={() => setStudyType('cards')}>
                  Flash Cards
                </div>
                <div className={`type-radio type-radio--quiz ${ studyType === 'quiz' ? 'type-radio-active' : '' }`} onClick={() => setStudyType('quiz')}>
                  Quiz
                </div>
              </div>
              {
                studyType === 'cards' ? (
                  <FlashCards content={studySet} />
                ) : (
                  <Quiz content={studySet} shuffleDeck={shuffleDeck} />
                )
              }
            </div>
          </>
        ) }
      </div>
    </main>
  )
}

export default page