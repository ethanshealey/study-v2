import { collection, db, query, getDocs, auth } from "@/firebase";
import { getAuth } from "firebase-admin/auth";
import { addDoc, and, doc, or, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/firebase-admin";
import StudySet from "@/types/StudySet";

export async function POST(request: NextRequest) {

    const body = await request.json()

    const access_token = body.user.stsTokenManager.accessToken

    const userVerification = await verifyAccessToken(access_token)

    if(userVerification && userVerification.email) {

        const newStudySet: StudySet = {
            title: body.title,
            createdBy: body.user.username,
            createdByEmail: userVerification.email,
            public: !body.isPrivate,
            items: body.questions,
            autofillOptions: body.autofillOptions
        }

        const setRef = doc(db, "StudySet", body.id)
        updateDoc(setRef, newStudySet)

        return NextResponse.json({ updated: true, newValue: newStudySet }, { status: 200 })
    }
    else
        return NextResponse.json('Not signed in', { status: 400 })
}