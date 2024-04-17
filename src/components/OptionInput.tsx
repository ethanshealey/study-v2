import React from 'react'
import Option from "@/types/Option"
import { FaTrashAlt } from "react-icons/fa";
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill  } from "react-icons/ri";
import { Tooltip } from 'react-tooltip'

type OptionInputType = {
    option: Option,
    idx: number,
    handleOptionContentChange: Function,
    deleteOption: Function,
    canDelete: Function,
    toggleCorrect: Function,
    autofillOptions: boolean
}

const OptionInput = ({ option, idx, handleOptionContentChange, deleteOption, canDelete, toggleCorrect, autofillOptions }: OptionInputType) => {

  const handleCorrectToggle = (e: any) => {
    e.preventDefault()
    toggleCorrect(idx)
  }

  const handleDeleteOption = (e: any) => {
    e.preventDefault()
    deleteOption(idx)
  }

  return (
    <div className="option">
        <input className={`option-input ${ autofillOptions ? 'hide-options' : '' }`} placeholder='Enter an option...' value={option.content} key={`option-input-${idx}`} onChange={(e) => handleOptionContentChange(e.target.value, idx)} />
        { !autofillOptions && (
          <div className='option-controls'>
              <Tooltip anchorSelect=".is-correct-tooltip" place="top">
                  Check this field to mark this as a correct answer
              </Tooltip>
              <button className='option-controls--btn' onClick={handleCorrectToggle}><a className="is-correct-tooltip" data-tooltip-delay-show="1000">{ option.isCorrect ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }</a></button>
              <button className='option-controls--btn delete' onClick={handleDeleteOption} disabled={canDelete()}><FaTrashAlt /></button>
          </div>
        )}
    </div>
  )
}

export default OptionInput