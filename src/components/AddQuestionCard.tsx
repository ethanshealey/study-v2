import Question from '@/types/Question'
import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeBlock from './CodeBlock';
import { propagateServerField } from 'next/dist/server/lib/render-server';
import Option from '@/types/Option';
import getBlankOption from '@/helpers/getBlankOption';
import OptionInput from './OptionInput';
import remarkGfm from 'remark-gfm';

type AddQuestionCardType = {
    question: Question,
    idx: number,
    onChange: Function,
    autofillOptions: boolean,
    handleDeleteQuestionCard: Function
}

const AddQuestionCard = ({ question, idx, onChange, autofillOptions, handleDeleteQuestionCard }: AddQuestionCardType) => {

  useEffect(() => {
    if(!question.options.length) {
      const firstOption = getBlankOption()
      onChange({ ...question, options: [ firstOption ] }, idx)
    }
  }, [])

  const handleOptionContentChange = (content: string, i: number) => {
    const tempOptions = [ ...question?.options ]
    tempOptions[i].content = content
    onChange({ ...question, options: tempOptions }, idx)
  }

  const deleteOption = (i: number) => {
    let tempOptions = [ ...question?.options ]
    tempOptions = tempOptions.filter((o: Option, idx: number) => idx !== i)
    onChange({ ...question, options: tempOptions }, idx)
  }

  const canDelete = (i: number) => {
    return i !== 0 && question.options.length === 1
  }

  const toggleCorrect = (i: number) => {
    const tempOptions = [ ...question?.options ]
    tempOptions[i].isCorrect = !tempOptions[i].isCorrect
    onChange({ ...question, options: tempOptions }, idx)
  }

  const addOption = () => { 
    const newOption = getBlankOption()
    onChange({ ...question, options: [ ...question?.options, newOption ] }, idx)
  }

  const handleQuestionChange = (content: string) => {
    let tempQ: Question = { ...question }
    tempQ.question = content
    onChange(tempQ, idx)
  }

  return (
    <div className="question-card">
      <div className="question-card--header">
        <h3 className="question-card--index">{ idx + 1 }</h3>
        <div className='question-card--controls'>
          <div className={`question-card--control`}  onClick={() => handleDeleteQuestionCard(idx)}>
            <FaTrashAlt />
          </div>
        </div>
      </div>
      <div className="question-card--content">
        <div className='question-card--content--left'>
          <textarea id={`textarea-${idx}`} placeholder='Enter your question (Can use markdown!)' value={question.question} onChange={(e) => handleQuestionChange(e.target.value)} />
          <div className='question-card--content--preview'>
            {
              question?.question ? (
                <Markdown
                  children={question?.question}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      return <CodeBlock children={props.children} className={props.className} node={props.node} />
                    }
                  }}
                />
              ) : (
                <p style={{ opacity: '50%' }}>Preview</p>
              )
            }
            
          </div>
        </div>
        <div className='question-card--content--right'>
          {
            autofillOptions ? 
            <OptionInput 
              question={question}
              key={`option-input-${idx}-${0}`}
              option={question.options[0]} 
              idx={0} 
              handleOptionContentChange={handleOptionContentChange} 
              deleteOption={deleteOption} 
              canDelete={canDelete} 
              toggleCorrect={toggleCorrect}
              autofillOptions={autofillOptions}
          /> : 
            question?.options?.map((option: Option, i: number) => (
              <OptionInput 
                question={question}
                key={`option-input-${idx}-${i}`}
                option={option} 
                idx={i} 
                handleOptionContentChange={handleOptionContentChange} 
                deleteOption={deleteOption} 
                canDelete={canDelete} 
                toggleCorrect={toggleCorrect}
                autofillOptions={autofillOptions}
              />
            ))
          }
          { !autofillOptions && <div className='add-option' onClick={addOption}>+ Add an option</div> }
        </div>
      </div>
    </div>
  )
}

export default AddQuestionCard