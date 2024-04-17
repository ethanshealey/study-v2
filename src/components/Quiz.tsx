import Option from '@/types/Option'
import StudySet from '@/types/StudySet'
import React, { useState } from 'react'
import MultipleChoiceOptions from './MultipleChoiceOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import Question from '@/types/Question'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'

type QuizType = {
  content: StudySet | undefined,
  shuffleDeck: Function
}

const Quiz = ({ content, shuffleDeck }: QuizType) => {

  const { width = 0, height = 0 } = useWindowSize()
  const [ questionIndex, setQuestionIndex ] = useState<number>(0)
  const [ correctAnswerCount, setCorrectAnswerCount ] = useState<number>(0)
  const [ showCorrectAnswer, setShowCorrectAnswer ] = useState<boolean>(false)
  const [ isCorrect, setIsCorrect ] = useState<boolean>(false)
  const [ isDone, setIsDone ] = useState<boolean>(false)
  const [ showResults, setShowResults ] = useState<boolean>(false)
  const [ showConfetti, setShowConfetti ] = useState<boolean>(false)
  
  const getCurrentQuestion = () => content?.items[questionIndex]

  const isMultiOptionQuestion = () => {
    const options: Option[] | undefined = getCurrentQuestion()?.options
    if(options) {
      return options.filter((o: Option) => o.isCorrect).length > 1
    }
    else {
      return false
    }
  }

  const handleSubmit = (picked: number[]) => {
    const correct_answer_count = content?.items[questionIndex]?.options?.filter((o: Option) => o.isCorrect).length
    const picked_answers = content?.items[questionIndex]?.options?.filter((o: Option, idx: number) => picked.includes(idx))

    const allAnswersAreCorrect = (ans: Option[]) => ans.every((o: Option) => o.isCorrect)

    if(allAnswersAreCorrect(picked_answers ?? []) && picked_answers?.length === correct_answer_count) {
      setCorrectAnswerCount(grade => grade + 1)
      setIsCorrect(true)
    }
    else
      setIsCorrect(false)
    setShowCorrectAnswer(true)

    if(questionIndex+1 === content?.items?.length) setIsDone(true)

  }

  const goToNextQuestion = () => {
    if(isDone) {
      // go to end window
      setShowResults(true)

      // Confetti!!!!!
      setShowConfetti(true)
      const timeout = setTimeout(() => {
        setShowConfetti(false)
        clearTimeout(timeout)
      }, 2500)

    }
    else {
      setShowCorrectAnswer(false)
      setQuestionIndex(p => p + 1)
    }
  }

  const generateResponse = () => {
    return "Good Job!"
  }

  const restart = () => {
    // Shuffle deck
    shuffleDeck()
    // Reset state
    setQuestionIndex(0)
    setCorrectAnswerCount(0)
    setShowCorrectAnswer(false)
    setIsCorrect(false)
    setIsDone(false)
    setShowResults(false)
  }

  return (
    <div id="quiz-wrapper">
      {

        showResults ? (
          <div id="quiz-result">
            {/* {
              showConfetti && <Confetti
                width={width}
                height={height}
              />
            } */}
            <Confetti
              width={width}
              height={height}
              numberOfPieces={showConfetti ? 200 : 0}
            />
            <h1>{ generateResponse() }</h1>
            <h1 id="result-percent">{(correctAnswerCount/(content?.items.length ?? 1)) * 100}%</h1>
            <button id="result-try-again-btn" onClick={restart}>Try Again</button>
          </div>
        ) : (
          <>
            <div id="quiz-question">
              <h1>{ getCurrentQuestion()?.question }</h1>
            </div>
            <div id="quiz-options">
              {
                isMultiOptionQuestion() ? 
                  (<MultipleChoiceOptions options={getCurrentQuestion()?.options} onSubmitAnswer={handleSubmit} isCorrect={isCorrect} showCorrectAnswer={showCorrectAnswer} goToNextQuestion={goToNextQuestion} isDone={isDone} />) : 
                  (<SingleChoiceOptions options={getCurrentQuestion()?.options} onSubmitAnswer={handleSubmit} isCorrect={isCorrect} showCorrectAnswer={showCorrectAnswer} goToNextQuestion={goToNextQuestion} isDone={isDone} />)
              }
            </div>
          </>
        )

      }
      
    </div>
  )
}

export default Quiz
