'use client'
import AddQuestionCard from '@/components/AddQuestionCard'
import Header from '@/components/Header'
import AuthContext from '@/context/AuthContext'
import Question from '@/types/Question'
import React, { useContext, useEffect, useState } from 'react'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill  } from "react-icons/ri";
import { toast } from 'react-hot-toast'
import toastTheme from '@/helpers/toastTheme'
import Option from '@/types/Option'
import { addDoc } from 'firebase/firestore'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

type EditPageType = {
    params: any
}

const EditPage = ({ params } : EditPageType) => {

    const user: any = useContext(AuthContext)
    const router = useRouter()
    const [ title, setTitle ] = useState<string>('')
    const [ questions, setQuestions ] = useState<Question[]>([])

    const [ isPrivate, setIsPrivate ] = useState<boolean>(false)
    const [ autofillOptions, setAutofillOptions ] = useState<boolean>(false)

    useEffect(() => {
        if(!user) return router.push('/')
        loadStudySet()
    }, [])

    const loadStudySet = async () => {
        const res = await fetch(`/api/v1/sets?email=${user?.email ?? ''}&id=${params.id}`)
        const data = await res.json()

        setTitle(data[0]?.title)
        setQuestions(data[0]?.items)
        setIsPrivate(!data[0]?.public)
        setAutofillOptions(data[0]?.autofillOptions)
    }

    const handleQuestionCardChange = (question: Question, idx: number) => {
        let tempQuestions: Question[] = [ ...questions ]
        tempQuestions[idx] = question
        setQuestions((_: any) => [ ...tempQuestions ])
    } 

    const handleDeleteQuestionCard = (idx: number) => {
        if(idx === 0 && questions.length === 1) return

        let tempQuestions: Question[] = [ ...questions ]
        tempQuestions = tempQuestions.filter((_: any, i: number) => i !== idx)
        setQuestions((_: any) => [ ...tempQuestions ])
    }

    const addQuestion = () => {
        setQuestions((p: Question[]) => [ ...p, { question: '', options: [] } ])
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        // Validate title is given
        if(!title) {
            return toast.error("A study set must have a title!", toastTheme)
        }
        if(questions.some((q: Question) => !q.question)) {
            return toast.error("One or more questions dont have value!", toastTheme)
        }
        if(questions.map((q: Question) => [ ...q.options.map((o: Option) => o.content) ]).flat().some((c: string) => !c)) {
            return toast.error("One or more options dont have value!", toastTheme)
        }

        const res = await fetch('/api/v1/sets/edit', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id: params.id,
                title: title,
                questions: questions,
                isPrivate: isPrivate,
                autofillOptions: autofillOptions,
                user: { ...auth.currentUser, username: user.username }
            })
        })
        const data = await res.json()

        router.push(`/set/${params.id}`)
    }
        
    return (
        <main>
            <Header />
            <div id="content">
                <div id="create">
                    <h1>Create a new Study Set</h1>
                    <form onSubmit={handleSubmit}>
                        <div id="create-header">
                            <input id="create-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Give your study set a title...' />
                            <button id="create-btn" onClick={handleSubmit}>Save</button>
                        </div>
                        <div id="create-options">
                            <div className="create-option-item" onClick={() => setIsPrivate(!isPrivate)}>{ isPrivate ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Private</div>
                            <div className="create-option-item" onClick={() => setAutofillOptions(!autofillOptions)}>{ autofillOptions ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Autofill Answers from other Questions</div>
                        </div>
                        {
                            questions.map((question: Question, idx: number) => (
                                <AddQuestionCard key={`add-question-card-${idx}`} question={question} idx={idx} onChange={handleQuestionCardChange} autofillOptions={autofillOptions} handleDeleteQuestionCard={handleDeleteQuestionCard} />
                            ))
                        }
                        <div id="add-question-btn" onClick={addQuestion}>+ Add Question</div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default EditPage