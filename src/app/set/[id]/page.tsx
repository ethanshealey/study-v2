'use client'
import FlashCards from '@/components/FlashCards'
import Header from '@/components/Header'
import AuthContext from '@/context/AuthContext'
import StudySet from '@/types/StudySet'
import Quiz from '@/components/Quiz'
import React, { useContext, useEffect, useState } from 'react'
import UserCard from '@/components/UserCard'
import shuffle from '@/helpers/shuffle'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaPencilAlt } from "react-icons/fa"
import { Tooltip } from 'react-tooltip'

type SetPageType = {
  params: any
}

const page = ({ params }: SetPageType) => {

  const user: any = useContext(AuthContext)
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const router = useRouter()
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
    if(data.length > 0) {
      const deck: StudySet = data[0]
      console.log(deck)
      deck.items = shuffle(deck.items)
      setStudySet((_: any) => deck)
    }
    setIsLoadingStudySet(false)
  }

  const shuffleDeck = () => {
    const copy = studySet
    copy!.items = shuffle(copy?.items ?? [])
    setStudySet(copy)
  }

  const editDeck = () => {
    if(user && user?.email === studySet?.createdByEmail) {
      router.push(`/set/${studySet?.id}/edit`)
    }
    return
  }

  return (
    <main>
      <Header />
      <div id="content">
        { isLoadingStudySet ? (<></>) : (
          <>
            <Tooltip anchorSelect=".edit-btn-msg" place="top" style={{ zIndex: 999 }}>
                  Edit this set
            </Tooltip>
            <h3 id="set-title">{ studySet?.title } { user.email === studySet?.createdByEmail ? <div id="edit-icon" className="edit-btn-msg" onClick={editDeck}><FaPencilAlt /></div> : <></> }</h3>
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