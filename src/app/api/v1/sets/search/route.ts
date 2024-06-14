import { collection, db, query, getDocs, auth } from "@/firebase";
import { getAuth } from "firebase-admin/auth";
import { addDoc, and, or, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/firebase-admin";
import StudySet from "@/types/StudySet";
import Question from "@/types/Question";
import Option from "@/types/Option";
import lunr from 'lunr'

export async function POST(request: NextRequest) {

    const body = await request.json()
    const access_token = body?.user?.stsTokenManager?.accessToken

    const userVerification = await verifyAccessToken(access_token)

    const q = body?.query

    if(!query) return NextResponse.json('No query provided', { status: 200 })

    let dbquery


    if(userVerification && userVerification.email) {
        dbquery = query(collection(db, 'StudySet'), or(
            where('public', '==', 'true'),
            where('createdByEmail', '==', userVerification.email)
        ))
    }
    else {
        dbquery = query(collection(db, 'StudySet'), where('public', '==', 'true'))
    }

    //get all documents that are public and/or created by user
    const qs = await getDocs(dbquery)

    const docs: any[] = []

    qs.forEach((doc: any) => {
        docs.push({
            ...doc.data(),
            items: doc.data().items.map((item: Question) => item.question + ' ' + item.options.map((o: Option) => o.content).join(', ')),
            id: `${docs.length + 1}`,
            actual: doc.id
        })
    })

    const idx = await lunr(async function(this: any) {
        this.field('title')
        this.field('items')
        this.field('createdBy')
        this.field('createdByEmail')

        for(let doc of docs) {
            this.add(doc)
        }
    })

    const results = idx.search(q)

    const resultSet: any[] = []

    results.forEach((res: any) => {
        resultSet.push(docs.filter((d) => d.id === res?.ref)[0])
    })

    let message = ''
    if(resultSet.length > 0) message = 'Successfully found ' + resultSet.length + ' items'
    else message = 'No search results found for \'' + q + '\''

    return NextResponse.json({ results: resultSet, message: message }, { status: 200 })

}