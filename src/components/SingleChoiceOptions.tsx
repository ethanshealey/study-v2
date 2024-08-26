import React, { useEffect, useState } from 'react'
import Option from '@/types/Option'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'

type SingleChoiceOptionsType = {
    options: Option[] | undefined,
    onSubmitAnswer: Function,
    isCorrect: boolean,
    showCorrectAnswer: boolean,
    goToNextQuestion: Function,
    isDone: boolean
}

const SingleChoiceOptions = ({ options, onSubmitAnswer, isCorrect, showCorrectAnswer, goToNextQuestion, isDone }: SingleChoiceOptionsType) => {

    const [ picked, setPicked ] = useState<number>(-1)

    useEffect(() => {
        setPicked(-1)
    }, [options])

    const pickOption = (idx: number) => {
        setPicked(idx)
    }

    const getClassName = (idx: number) => {
        if(!options) return ''

        if(showCorrectAnswer) {
            if(options[idx]?.isCorrect) {
                return 'correct-answer'
            }
            else if(picked === idx) {
                return 'incorrect-answer'
            }
        }
        else {
            return picked === idx ? 'picked' : ''
        }
    }

    const getClassNameDot = (idx: number) => {
        if(!options) return ''

        if(showCorrectAnswer) {
            if(options[idx]?.isCorrect) {
                return 'correct-answer-dot'
            }
            else if(picked === idx) {
                return 'incorrect-answer-dot'
            }
        }
        else {
            return picked === idx ? 'dot-active' : ''
        }
    }

    return (
        <div id="single-choice">
            <div id="options">
                {
                    options && options?.map((option: Option, idx: number) => (
                        <div className={`option-btn ${getClassName(idx)}`} key={`option-${idx}`} onClick={() => pickOption(idx)}>
                            <input type="radio" id={`option-${idx}`} name="options" className='option-input' />
                            <label htmlFor={`option-${idx}`} >
                                <div className={`dot ${ getClassNameDot(idx) }`}></div>
                                <span>
                                    <Markdown
                                        children={option.content}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code(props) {
                                            return <CodeBlock children={props.children} className={props.className} node={props.node} />
                                            }
                                        }}
                                    />
                                </span>
                            </label>
                        </div>
                    ))
                }
            </div>
            <div className="br" />
            <div id="quiz-sub-options">
                {
                    showCorrectAnswer ? 
                        <button disabled={picked === -1} onClick={() => goToNextQuestion()}>{ isDone ? 'Finish' : 'Next' }</button> :
                        <button disabled={picked === -1} onClick={() => onSubmitAnswer([ picked ])}>Submit</button>
                }
            </div>
        </div>
        
    )
}

export default SingleChoiceOptions