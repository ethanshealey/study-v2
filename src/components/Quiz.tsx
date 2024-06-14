import Option from '@/types/Option'
import StudySet from '@/types/StudySet'
import React, { useEffect, useState } from 'react'
import MultipleChoiceOptions from './MultipleChoiceOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import Question from '@/types/Question'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import getThreeRandomOptions from '@/helpers/getThreeRandomOptions'
import shuffle from '@/helpers/shuffle'

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
  const [ autofilledOptions, setAutofilledOptions ] = useState<Option[][]>([])

  useEffect(() => {
    if(content?.autofillOptions) {
      const all_options: Option[] = content.items.map((i: Question) => i.options).flat()
      for(let i = 0; i < content.items.length; i++) {
        const correct_answer = content?.items[i]?.options[0]
        correct_answer.isCorrect = true
        let answers: Option[] = [ correct_answer ]
        answers.push(...getThreeRandomOptions(all_options, correct_answer))
        console.log(answers)
        // autofilledOptions.push(shuffle(answers))
        setAutofilledOptions([ ...shuffle(answers) ])
      }
    }
  }, [])
  
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
              <Markdown
                  children={getCurrentQuestion()?.question}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      return <CodeBlock children={props.children} className={props.className} node={props.node} />
                    }
                  }}
                />
            </div>
            <div id="quiz-options">
              {
                isMultiOptionQuestion() ? 
                  (<MultipleChoiceOptions options={content?.autofillOptions ? autofilledOptions[questionIndex] : getCurrentQuestion()?.options} onSubmitAnswer={handleSubmit} isCorrect={isCorrect} showCorrectAnswer={showCorrectAnswer} goToNextQuestion={goToNextQuestion} isDone={isDone} />) : 
                  (<SingleChoiceOptions options={content?.autofillOptions ? autofilledOptions[questionIndex] : getCurrentQuestion()?.options} onSubmitAnswer={handleSubmit} isCorrect={isCorrect} showCorrectAnswer={showCorrectAnswer} goToNextQuestion={goToNextQuestion} isDone={isDone} />)
              }
            </div>
          </>
        )

      }
      
    </div>
  )
}

export default Quiz
