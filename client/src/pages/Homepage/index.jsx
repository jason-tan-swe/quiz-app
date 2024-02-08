import { useState } from 'react'
import JoinForm from './JoinForm'
import CreateForm from './CreateForm'
import NavigationButtons from './NavigationButtons'

const Homepage = ({ setIsConnected }) => {
  const [isCreateForm, setIsCreateForm] = useState(null)
  const [isOnForm, setIsOnForm] = useState(false)

  return (
    <div className="flex flex-col justify-center md:text-3xl">
      <h1 className="text-white text-xl text-center p-2 shadow-md rounded-t-md bg-purple-500 font-bold md:text-5xl md:p-8">
        Quiz App
      </h1>
      {isOnForm && (
        <input
          className="hover:cursor-pointer hover:bg-purple-500 hover:text-white transition-colors border-solid border-purple-500 border-2 p-2 m-2 rounded-md text-purple-500"
          type="button"
          value="Back"
          onClick={() => {
            setIsCreateForm(null)
            setIsOnForm(false)
          }}
        />
      )}

      {isOnForm ? (
        isCreateForm ? (
          <CreateForm setIsConnected={setIsConnected} />
        ) : (
          <JoinForm setIsConnected={setIsConnected} />
        )
      ) : (
        <NavigationButtons
          setIsCreateForm={setIsCreateForm}
          setIsOnForm={setIsOnForm}
        />
      )}
    </div>
  )
}

export default Homepage
