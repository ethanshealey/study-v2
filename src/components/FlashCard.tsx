import Option from '@/types/Option'
import Question from '@/types/Question'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'

type FlashCardType = {
    card: Question | undefined,
    flip: boolean,
    setFlip: Function
}

const FlashCard = ({ card, flip, setFlip }: FlashCardType) => {
  return (
    <div className="current-card">
        <div className={`card ${flip ? 'flipped' : ''}`} onClick={() => setFlip((p: boolean) => !p)}>
            <div className="front">
                {/* { card?.question } */}
                <Markdown
                  children={card?.question}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      return <CodeBlock children={props.children} className={props.className} node={props.node} />
                    }
                  }}
                />
            </div>
            <div className="back">
              {
                card?.options.map((option: Option, idx: number) => {                    
                    return option.isCorrect && (
                        <h1 key={`flash-card-${idx}`}>{ option.content }</h1>
                    )
                })
              }
            </div>
        </div>
    </div>
  )
}

export default FlashCard