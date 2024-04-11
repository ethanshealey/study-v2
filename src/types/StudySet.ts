import Question from "./Question"

type StudySet = {
    id: string,
    title: string,
    createdBy: string,
    createdByEmail: string,
    items: Question[]
}

export default StudySet