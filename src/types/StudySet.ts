import Question from "./Question"

type StudySet = {
    id?: string,
    title: string,
    createdBy: string,
    createdByEmail: string,
    public: boolean,
    items: Question[],
    autofillOptions: boolean,
    allowFlash: boolean,
    allowQuiz: boolean
}

export default StudySet