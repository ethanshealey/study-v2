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

const page = () => {

    const user: any = useContext(AuthContext)
    const [ title, setTitle ] = useState<string>('')
    const [ questions, setQuestions ] = useState<Question[]>([])

    const [ isPrivate, setIsPrivate ] = useState<boolean>(false)
    const [ autofillOptions, setAutofillOptions ] = useState<boolean>(false)

    useEffect(() => {
        // Initalize first blank question
        addQuestion()
    }, [])

    const handleQuestionCardChange = (question: Question, idx: number) => {
        let tempQuestions: Question[] = [ ...questions ]
        tempQuestions[idx] = question
        setQuestions((_: any) => [ ...tempQuestions ])
    } 

    const addQuestion = () => {
        setQuestions((p: Question[]) => [ ...p, { question: '', options: [] } ])
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(title, questions, autofillOptions)

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
                            <button id="create-btn" onClick={handleSubmit}>Create</button>
                        </div>
                        <div id="create-options">
                            <div className="create-option-item" onClick={() => setIsPrivate(!isPrivate)}>{ isPrivate ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Private</div>
                            <div className="create-option-item" onClick={() => setAutofillOptions(!autofillOptions)}>{ autofillOptions ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Autofill Answers from other Questions</div>
                        </div>
                        {
                            questions.map((question: Question, idx: number) => (
                                <AddQuestionCard key={`add-question-card-${idx}`} question={question} idx={idx} onChange={handleQuestionCardChange} autofillOptions={autofillOptions} />
                            ))
                        }
                        <div id="add-question-btn" onClick={addQuestion}>+ Add Question</div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default page