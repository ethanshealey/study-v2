import { collection, db, query, getDocs } from "@/firebase";
import { or, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const url = new URL(request.url)
    const email = url.searchParams.get('email') ?? ''

    console.log(email)

    const q = query(collection(db, 'StudySet'), or(
        where('public', '==', true), 
        where('createdByEmail', '==', email)
    ))

    // getDocs(q).then((qs: any) => {
    //   const sets = qs.docs.map((item: any) => { return { ...item.data(), id: item.id } })
    //   return NextResponse.json({ sets: sets }, { status: 200 })
    // })

    const qs = await getDocs(q)
    const sets = qs.docs.map((item: any) => { return { ...item.data(), id: item.id } })
    return NextResponse.json([ ...sets ], { status: 200 })

}