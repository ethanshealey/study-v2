import { collection, db, getDocs, query, where } from "@/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const url = new URL(request.url)
    const email = url.searchParams.get('email') ?? ''

    let q

    if(email) {
        // only get users stats
        q = query(collection(db, 'StudySet'), where('createdByEmail', '==', email))
    }
    else {
        q = query(collection(db, 'StudySet'))
    }

    const qs = await getDocs(q)
    const count = qs.docs.length

    return NextResponse.json({ count: count }, {status: 200})

}