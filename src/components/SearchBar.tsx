import React from 'react'
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div id="search-box">
        <div id="search-box-icon">
            <FaSearch />
        </div>
        <input id="search-box-input" placeholder='Search for anything' />
    </div>
  )
}

export default SearchBar