import { auth, collection, db, getDocs, onAuthStateChanged, query, where } from "@/firebase";
import { createContext, useEffect } from "react";

const AuthContext = createContext(undefined)

export default AuthContext