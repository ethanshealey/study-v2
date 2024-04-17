import React from 'react'

type UserCardType = {
    username: string,
    email: string
}

const UserCard = ({ username, email }: UserCardType) => {
  return (
    <div id="user-card">
        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} />
        <p>{ username }</p>
    </div>
  )
}

export default UserCard