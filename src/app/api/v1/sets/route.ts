import { collection, db, query, getDocs } from "@/firebase";
import { and, or, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const url = new URL(request.url)
    const email = url.searchParams.get('email') ?? ''
    const userOnly = url.searchParams.get('userOnly') ?? ''
    const id = url.searchParams.get('id') ?? ''

    let q

    if(id) 
        q = query(collection(db, "StudySet"), 
            and(
                where('__name__', '==', id), 
                or(
                    where('public', '==', true), 
                    where('createdByEmail', '==', email)
                )
            ))
    else if(userOnly) 
        q = query(collection(db, 'StudySet'), where('createdByEmail', '==', email))
    else
        q = query(collection(db, 'StudySet'), or(
            where('public', '==', true), 
            where('createdByEmail', '==', email)
        ))

    const qs = await getDocs(q)
    const sets = qs.docs.map((item: any) => { return { ...item.data(), id: item.id } })
    return NextResponse.json([ ...sets ], { status: 200 })

}