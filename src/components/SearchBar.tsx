import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";

type SearchBarType = {
  cb?: Function
} 

const SearchBar = ({ cb }: SearchBarType) => {

  const router = useRouter()
  const [ query, setQuery ] = useState<string>('')

  const onSearch = (e: any) => {
    e.preventDefault()
    if(cb) {
      cb(query)
    }
    else router.push(`/search?q=${query}`)
  }

  return (
    <form id="search-box" onSubmit={onSearch}>
        <div id="search-box-icon">
            <FaSearch />
        </div>
        <input id="search-box-input" placeholder='Search for anything' value={query} onChange={(e) => setQuery(e.target.value)} />
    </form>
  )
}

export default SearchBar