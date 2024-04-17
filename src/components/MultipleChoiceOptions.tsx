import React, { useEffect, useState } from 'react'
import Option from '@/types/Option'

type MultipleChoiceOptionsType = {
    options: Option[] | undefined,
    onSubmitAnswer: Function,
    isCorrect: boolean,
    showCorrectAnswer: boolean,
    goToNextQuestion: Function,
    isDone: boolean
}

const MultipleChoiceOptions = ({ options, onSubmitAnswer, isCorrect, showCorrectAnswer, goToNextQuestion, isDone }: MultipleChoiceOptionsType) => {
    const [ picked, setPicked ] = useState<number[]>([])

    const pickOption = (idx: number) => {
        if(picked.includes(idx))  setPicked(p => [ ...p.filter((v: number, i: number) => v !== idx) ])
        else setPicked(p => [ ...p, idx ])
    }

    const getClassName = (idx: number) => {
        if(!options) return ''

        if(showCorrectAnswer) {
            if(options[idx]?.isCorrect) {
                return 'correct-answer'
            }
            else if(picked.includes(idx)) {
                return 'incorrect-answer'
            }
        }
        else {
            return picked.includes(idx) ? 'picked' : ''
        }
    }

    const getClassNameDot = (idx: number) => {
        if(!options) return ''

        if(showCorrectAnswer) {
            if(options[idx]?.isCorrect) {
                return 'correct-answer-square'
            }
            else if(picked.includes(idx)) {
                return 'incorrect-answer-square'
            }
        }
        else {
            return picked.includes(idx) ? 'square-active' : ''
        }
    }

    return (
        <div id="single-choice">
            <div id="options">
                {
                    options?.map((option: Option, idx: number) => (
                        <div className={`option-btn ${getClassName(idx)}`} key={`option-${idx}`}>
                            <input type="checkbox" id={`option-${idx}`} name="options" className='option-input' />
                            <label htmlFor={`option-${idx}`} onClick={() => pickOption(idx)} >
                                <div className={`square ${ getClassNameDot(idx) }`}></div>
                                <span>{ option.content }</span>
                            </label>
                        </div>
                    ))
                }
            </div>
            <div className="br" />
            <div id="quiz-sub-options">
                {
                    showCorrectAnswer ? 
                        <button disabled={!picked} onClick={() => goToNextQuestion()}>{ isDone ? 'Finish' : 'Next' }</button> :
                        <button disabled={!picked} onClick={() => onSubmitAnswer(picked)}>Submit</button>
                }
            </div>
        </div>
        
    )
}

export default MultipleChoiceOptions