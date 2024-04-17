import StudySet from '@/types/StudySet'
import { useRouter } from 'next/navigation'
import React from 'react'

type StudySetCardType = {
    set: StudySet
}

const StudySetCard = ({ set }: StudySetCardType) => {

    const router = useRouter()

    const openStudySet = () => {
        console.log(set)
        router.push(`/set/${set.id}?type=cards`)
    }

    return (
        <div className='study-set' onClick={openStudySet}>
            <h3>{set.title}</h3>
            <p className="term-count">{ set.items.length } term{ set.items.length != 1 ? 's' : '' }</p>
            <p className='created-by'><img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${set.createdBy}`} /> {set.createdBy}</p>
        </div>
    )
}

export default StudySetCard