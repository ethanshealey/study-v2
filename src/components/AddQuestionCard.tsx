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
    autofillOptions: boolean
}

const AddQuestionCard = ({ question, idx, onChange, autofillOptions }: AddQuestionCardType) => {

  const [ questionContent, setQuestionContent ] = useState<string>('')

  const [ options, setOptions ] = useState<Option[]>([])

  useEffect(() => {
    const tempQ: Question = {
      question: questionContent,
      options: options
    }
    onChange(tempQ, idx)
  }, [questionContent, options])

  useEffect(() => {
    if(!options.length) {
      const firstOption = getBlankOption()
      setOptions((_: any) => [ firstOption ])
    }
  }, [])

  const handleOptionContentChange = (content: string, i: number) => {
    const tempOptions = [ ...options ]
    tempOptions[i].content = content
    setOptions((_: any) => [ ...tempOptions ])
  }

  const deleteOption = (i: number) => {
    let tempOptions = [ ...options ]
    tempOptions = tempOptions.filter((o: Option, idx: number) => idx !== i)
    setOptions((_: any) => [ ...tempOptions ])
  }

  const canDelete = (i: number) => {
    return i !== 0 && options.length === 1
  }

  const toggleCorrect = (i: number) => {
    const tempOptions = [ ...options ]
    tempOptions[i].isCorrect = !tempOptions[i].isCorrect
    setOptions((_: any) => [ ...tempOptions ])
  }

  const addOption = () => { 
    const newOption = getBlankOption()
    setOptions((oldOptions: Option[]) => [ ...oldOptions, newOption ])
  }

  return (
    <div className="question-card">
      <div className="question-card--header">
        <h3 className="question-card--index">{ idx + 1 }</h3>
        <div className='question-card--controls'>
          <div className='question-card--control'>
            <FaTrashAlt />
          </div>
        </div>
      </div>
      <div className="question-card--content">
        <div className='question-card--content--left'>
          <textarea placeholder='Enter your question (Can use markdown!)' onChange={(e) => setQuestionContent(e.target.value)} />
          <div className='question-card--content--preview'>
            {
              questionContent ? (
                <Markdown
                  children={questionContent}
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
            options.map((option: Option, i: number) => (
              <OptionInput 
                key={`option-input-${idx}-${i}`}
                option={option} 
                idx={i} 
                handleOptionContentChange={handleOptionContentChange} 
                deleteOption={deleteOption} 
                canDelete={canDelete} 
                toggleCorrect={toggleCorrect}
                autofillOptions={autofillOptions}
              />
              // <input className='option-input' placeholder='Enter an option...' value={option.content} key={`option-input-${i}`} onChange={(e) => handleOptionContentChange(e.target.value, i)} />
            ))
          }
          { !autofillOptions && <div className='add-option' onClick={addOption}>+ Add an option</div> }
        </div>
      </div>
    </div>
  )
}

export default AddQuestionCard