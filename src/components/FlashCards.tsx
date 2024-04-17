import StudySet from '@/types/StudySet'
import React, { useEffect, useState } from 'react'
import FlashCard from './FlashCard'
import { VscDebugRestart } from 'react-icons/vsc'
import sleep from '@/helpers/sleep'

type FlashCardsType = {
  content: StudySet | undefined,
}

const FlashCards = ({ content }: FlashCardsType) => {

  const [ cardIndex, setCardIndex ] = useState<number>(0)
  const [ flip, setFlip ] = useState<boolean>(false)
  
  const getCurrentCard = () => content?.items[cardIndex]

  const changeCard = async (direction: 'prev' | 'next' | 'restart') => {
    setFlip(false)
    await sleep(100)
    switch(direction) {
      case 'prev': 
        setCardIndex(c => c - 1)
        break
      case 'next':
        setCardIndex(c => c + 1)
        break
      case 'restart':
        setCardIndex(0)
        break
    }
  }

  return (
    <div id="card-stack-wrapper">
      <FlashCard card={getCurrentCard()} flip={flip} setFlip={setFlip} />
      <div className='progress'>
          <progress value={cardIndex + 1} max={content?.items.length} />
      </div>
      <div className="controls">
        <button className='deck-restart' disabled={cardIndex === 0} onClick={() => changeCard('restart')}><VscDebugRestart /></button>
        <button className='deck-prev' disabled={cardIndex === 0} onClick={() => changeCard('prev')}>Previous</button>
        <button className='deck-next' disabled={cardIndex + 1 === content?.items?.length} onClick={() => changeCard('next')}>Next</button>
      </div>
    </div>
  )
}

export default FlashCards