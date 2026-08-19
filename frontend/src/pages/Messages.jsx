import { useEffect, useState } from "react"

function Messages({ user }) {
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [thread, setThread] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }

  const loadConversations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/messages/conversations",
        { headers: authHeader }
      )

      const data = await response.json()

      if (response.ok) {
        setConversations(data)
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const openConversation = async (conversation) => {
    setSelected(conversation)

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${conversation.user_id}`,
        { headers: authHeader }
      )

      const data = await response.json()

      if (response.ok) {
        setThread(data)
        loadConversations()
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!text.trim() || !selected) return

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader
        },
        body: JSON.stringify({
          receiverId: selected.user_id,
          content: text
        })
      })

      const data = await response.json()

      if (response.ok) {
        setThread((prev) => [...prev, data])
        setText("")
        loadConversations()
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage("Cannot connect to server")
    }
  }

  if (loading) {
    return (
      <main className="messages-page">
        <p>Loading messages...</p>
      </main>
    )
  }

  return (
    <main className="messages-page">

      <div className="messages-header">
        <div>
          <p className="page-label">COMMUNICATION</p>
          <h1>Messages</h1>
          <p>Stay connected with your professional network.</p>
        </div>
      </div>

      {message && (
        <div className="applicant-message">
          {message}
        </div>
      )}

      <div className="messages-layout">

        <div className="conversation-list">

          <div className="conversation-search">
            <input type="text" placeholder="Search conversations..." disabled />
          </div>

          {conversations.length === 0 ? (
            <p style={{ padding: "1rem" }}>
              Connect with people in your network to start messaging.
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                className="conversation"
                key={conversation.user_id}
                onClick={() => openConversation(conversation)}
              >

                <div className="message-avatar">
                  {conversation.name.charAt(0)}
                </div>

                <div className="conversation-info">
                  <div>
                    <strong>{conversation.name}</strong>

                    {conversation.unread_count > 0 && (
                      <span className="unread-badge">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>

                  <p>
                    {conversation.last_message || "Say hello 👋"}
                  </p>
                </div>

              </div>
            ))
          )}

        </div>

        {selected ? (
          <div className="message-thread">

            <div className="thread-header">
              <strong>{selected.name}</strong>
            </div>

            <div className="thread-body">
              {thread.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender_id === user.id
                      ? "thread-message sent"
                      : "thread-message received"
                  }
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <form className="thread-input" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button type="submit">Send</button>
            </form>

          </div>
        ) : (
          <div className="message-empty">
            <div className="message-empty-icon">✉</div>
            <h2>Select a conversation</h2>
            <p>Choose a conversation from the left to start messaging.</p>
          </div>
        )}

      </div>

    </main>
  )
}

export default Messages
