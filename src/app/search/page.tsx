'use client' 
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import Spinner from '@/components/Spinner'
import StudySetCard from '@/components/StudySetCard'
import AuthContext from '@/context/AuthContext'
import { auth } from '@/firebase'
import sleep from '@/helpers/sleep'
import StudySet from '@/types/StudySet'
import { useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const page = () => {

  const user: any = useContext(AuthContext)
  const searchParams = useSearchParams()
  const [ query, setQuery ] = useState<string>('')
  const [ isLoadingStudySets, setIsLoadingStudySets ] = useState<boolean>(false)
  const [ searchResults, setSearchResults ] = useState<StudySet[]>([])
  const [ searchErrorMessage, setSearchErrorMessage ] = useState<string>('')

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    if(q) {
      setQuery((_: any) => q)
      onSearch(undefined)
    }
  }, [])

  const onSearch = async (e: any) => {
    setIsLoadingStudySets(true)
    e?.preventDefault()
    const res = await fetch(`/api/v1/sets/search`, {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        user: { ...auth.currentUser, username: user?.username ?? '' }
      })
    })
    const data = await res.json()

    console.log(data)

    if(data?.results.length === 0) {
      setSearchErrorMessage(data?.message)
      setSearchResults([])
    }
    else {
      setSearchErrorMessage('')
      setSearchResults(data.results)
    }
    setIsLoadingStudySets(false)
  }

  return (
    <main>
      <Header hideSearch />
      <div id="content">
        <div id="sets">
          <h1>Search</h1>
          <form id="search-box" style={{ marginTop: '-25px' }} onSubmit={onSearch}>
              <div id="search-box-icon">
                  <FaSearch />
              </div>
              <input id="search-box-input" placeholder='Search for anything' value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          { searchErrorMessage && <p id="no-search-results">{searchErrorMessage}</p> }
          { searchResults && (
            <div id="set-list" className='search-result-list'>
            {
                isLoadingStudySets ? (
                <div className="spinner-wrapper">
                  <Spinner />
                </div>
                ) : (
                searchResults.map((set: StudySet, idx: number) => (
                  <StudySetCard key={`user-study-set-${idx}`} set={set} />
                )))
            }
            </div>
          ) }
        </div>
      </div>
    </main>
  )
}

export default page