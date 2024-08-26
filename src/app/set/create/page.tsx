'use client'
import AddQuestionCard from '@/components/AddQuestionCard'
import Header from '@/components/Header'
import AuthContext from '@/context/AuthContext'
import Question from '@/types/Question'
import React, { useContext, useEffect, useState } from 'react'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill, RiUpload2Line } from "react-icons/ri";
import { toast } from 'react-hot-toast'
import toastTheme from '@/helpers/toastTheme'
import Option from '@/types/Option'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Modal, ConfigProvider, theme } from "antd";
import Markdown from 'react-markdown'
import CodeBlock from '@/components/CodeBlock'
import remarkGfm from 'remark-gfm'

const page = () => {

    const router = useRouter()
    const user: any = useContext(AuthContext)
    const [ title, setTitle ] = useState<string>('')
    const [ questions, setQuestions ] = useState<Question[]>([])

    const [ isPrivate, setIsPrivate ] = useState<boolean>(false)
    const [ autofillOptions, setAutofillOptions ] = useState<boolean>(false)
    const [ allowQuiz, setAllowQuiz ] = useState<boolean>(true)
    const [ allowFlash, setAllowFlash ] = useState<boolean>(true)

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false)

    const [ file, setFile ] = useState<any>()

    useEffect(() => {
        // Initalize first blank question
        addQuestion()
    }, [])

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

        const res = await fetch('/api/v1/sets/add', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                title: title,
                questions: questions,
                isPrivate: isPrivate,
                autofillOptions: autofillOptions,
                allowQuiz: allowQuiz,
                allowFlash: allowFlash,
                user: { ...auth.currentUser, username: user.username }
            })
        })
        const data = await res.json()
        router.push(`/set/${data.id}`)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleJsonFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) 
            setFile(event.target.files[0])
    }

    const processJsonFile = async () => {
        try {
            const content = await new Response(file).json()
            console.log(content)
            const newQuestions: Question[] = []

            content.forEach((item: any) => {
                let newQuestion: Question = { question: "", options: [] }
                newQuestion.question = item.question
                item?.answers?.forEach((ans: any) => {
                    newQuestion.options.push({ isCorrect: ans.isCorrect, content: ans.text })
                })
                newQuestions.push(newQuestion)
            })

            setQuestions(newQuestions)
            setIsModalOpen(false)
        }
        catch(e) {
            console.log('bad file', e)
            toast.error("Invalid json file provided", toastTheme)
        }

    }

    const exampleJsonFile = `[
    {
        "question": "Title of the question here",
        "answers": [
            {
                 "isCorrect": true,
                 "text": "Option 1 text"                               
            },
            {
                 "isCorrect": false,
                 "text": "Option 2 text"                               
            },
            {
                 "isCorrect": false,
                 "text": "Option 3 text"                               
            },
            {
                 "isCorrect": false,
                 "text": "Option 4 text"                               
            }
        ]
    }
]`
        
    return (
        <main>
            <Header />
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <Modal title="Upload a Question Set" footer={null} open={isModalOpen} onOk={closeModal} onCancel={closeModal}>
                    <p>Upload questions and answers from a valid json file. The json file must follow this template:</p>
                    <Markdown
                        children={"```json\n" + exampleJsonFile + "\n```"}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code(props) {
                                return <CodeBlock children={props.children} className={props.className} node={props.node} />
                            }
                        }}
                    />
                    <p>This process can handle single-answer questions as well as multi-answer questions.</p>
                    <input type="file" accept='.json' className="modal-upload-btn" onChange={(e) => handleJsonFileUpload(e)} />
                    <button className="modal-file-upload-btn" disabled={!file} onClick={processJsonFile}>Upload</button>
                </Modal>
            </ConfigProvider>
            <div id="content">
                <div id="create">
                    <h1>Create a new Study Set</h1>
                    <form onSubmit={handleSubmit}>
                        <div id="create-header">
                            <input id="create-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Give your study set a title...' />
                            <button id="create-btn" onClick={handleSubmit}>Create</button>
                        </div>
                        <div id="create-options">
                            <div className="create-options-list">
                                <div className="create-option-item" onClick={() => setIsPrivate(!isPrivate)}>{ isPrivate ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Private</div>
                                <div className="create-option-item" onClick={() => setAutofillOptions(!autofillOptions)}>{ autofillOptions ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Autofill Answers from other Questions</div>
                                <div className="create-option-item" onClick={() => setAllowQuiz(!allowQuiz)}>{ allowQuiz ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Allow Quiz</div>
                                <div className="create-option-item" onClick={() => setAllowFlash(!allowFlash)}>{ allowFlash ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }&nbsp;Allow Flash Cards</div>
                            </div>
                            <div style={{ borderLeft: "2.5px solid #1c1b22" }} />
                            <div className="create-auto-upload">
                                <div className="create-auto-upload-btn" onClick={() => setIsModalOpen(p => !p)}><RiUpload2Line />&nbsp;Upload</div>
                            </div>
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

export default page