import Option from '@/types/Option'
import Question from '@/types/Question'
import React from 'react'

type FlashCardType = {
    card: Question | undefined,
    flip: boolean,
    setFlip: Function
}

const FlashCard = ({ card, flip, setFlip }: FlashCardType) => {
  return (
    <div className="current-card">
        <div className={`card ${flip ? 'flipped' : ''}`} onClick={() => setFlip((p: boolean) => !p)}>
            <div className="front"><h1>{ card?.question }</h1></div>
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