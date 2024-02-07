const NavigationButtons = ({ setIsOnForm, setIsCreateForm }) => {
  const handleCreateRoom = e => {
    setIsCreateForm(true)
    setIsOnForm(true)
  }

  const handleJoinRoom = e => {
    setIsCreateForm(false)
    setIsOnForm(true)
  }

  const buttonStyles =
    'text-white hover:cursor-pointer hover:bg-purple-400 bg-purple-500 mt-2 font-semibold rounded-md p-2'

  return (
    <form className="flex flex-col p-12 rounded-md shadow-xl gap-2">
      <input
        className={buttonStyles}
        type="button"
        value="Create a room"
        onClick={handleCreateRoom}
      />
      <input
        className={buttonStyles}
        type="button"
        value="Join a room"
        onClick={handleJoinRoom}
      />
    </form>
  )
}

export default NavigationButtons
