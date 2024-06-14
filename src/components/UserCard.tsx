import { useRouter } from 'next/navigation'
import React from 'react'

type UserCardType = {
    username: string,
    email: string
}

const UserCard = ({ username, email }: UserCardType) => {

  const router = useRouter()

  const searchForuser = () => {
    router.push(`/search?q=${username}`)
  }

  return (
    <div id="user-card" onClick={searchForuser}>
        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} />
        <p>{ username }</p>
    </div>
  )
}

export default UserCard