import { useState, useRef, useEffect } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Chatbot() {

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [currentChatId, setCurrentChatId] = useState(null);

  const [chats, setChats] = useState([]);

  const messagesContainerRef = useRef(null);
 

  const fetchChats = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/get-chats/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setChats(res.data);

    // AUTO OPEN LATEST CHAT

    if (
  res.data.length > 0 &&
  currentChatId === null
) {

  openChat(res.data[0].id);

} else if (res.data.length === 0) {

  createNewChat();

}

  } catch (err) {

    console.log(err);

  }
};


  const createNewChat = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://127.0.0.1:8000/create-chat/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentChatId(res.data.id);

      setMessages([
        {
          sender: "ai",
          text: "Hello 👋 How can I assist you today?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      fetchChats();

    } catch (err) {

      console.log(err);
    }
  };



  const openChat = async (chatId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://127.0.0.1:8000/chat-messages/${chatId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedMessages = res.data.map((msg) => ({
        sender: msg.sender,
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(
  formattedMessages.length > 0
    ? formattedMessages
    : [
        {
          sender: "ai",
          text: "Hello 👋 How can I assist you today?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]
);

      setCurrentChatId(chatId);

    } catch (err) {

      console.log(err);
    }
  };



  useEffect(() => {

  const initialize = async () => {

    await fetchChats();

  };

  initialize();

}, []);

useEffect(() => {

  if (messagesContainerRef.current) {

    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;

  }

}, [messages]);


 

  const clearChat = async () => {

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      "http://127.0.0.1:8000/clear-chat/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: {
          session_id: currentChatId,
        },
      }
    );

    setMessages([
      {
        sender: "ai",
        text: "Hello 👋 How can I assist you today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    fetchChats();

  } catch (err) {

    console.log(err);

  }
};

const deleteChat = async (chatId) => {

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `http://127.0.0.1:8000/delete-chat/${chatId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // refresh chats
    fetchChats();

    // current open chat deleted
    if (currentChatId === chatId) {

      setMessages([]);

      setCurrentChatId(null);

    }

  } catch (err) {

    console.log(err);

  }


};

const renameChat = async (chatId) => {

  const newTitle = prompt("Enter new chat title");

  if (!newTitle) return;

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://127.0.0.1:8000/rename-chat/${chatId}/`,
      {
        title: newTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchChats();

  } catch (err) {

    console.log(err);

  }
};

const deleteAllChats = async () => {

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      "http://127.0.0.1:8000/delete-all-chats/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setChats([]);

    setMessages([]);

    setCurrentChatId(null);

  } catch (err) {

    console.log(err);

  }
};




  const typeMessage = (fullText, callback) => {

    let index = 0;

    let currentText = "";

    const interval = setInterval(() => {

      currentText += fullText[index];

      callback(currentText);

      index++;

      if (index >= fullText.length) {

        clearInterval(interval);
      }

    }, 10);
  };



  const sendMessage = async () => {

  if (!message.trim()) return;

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userMessage = {
    sender: "user",
    text: message,
    time: currentTime,
  };

  setMessages((prev) => [...prev, userMessage]);

  const currentMessage = message;

  setMessage("");

  setLoading(true);

  try {

    const token = localStorage.getItem("token");


    let chatId = currentChatId;

    if (!chatId) {

      const res = await axios.post(
        "http://127.0.0.1:8000/create-chat/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      chatId = res.data.id;

      setCurrentChatId(chatId);

      fetchChats();
    }



    const res = await axios.post(
      "http://127.0.0.1:8000/ai-chat/",
      {
        message: currentMessage,
        session_id: chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const aiReply = res.data.reply;

    const aiMessage = {
      sender: "ai",
      text: "",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);

    setLoading(false);

    typeMessage(aiReply, (typedText) => {

      setMessages((prev) => {

        const updated = [...prev];

        updated[updated.length - 1].text = typedText;

        return [...updated];
      });

    });

    fetchChats();

  } catch (err) {

    console.log(err);

    setLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "Error loading AI response ❌",
        time: currentTime,
      },
    ]);
  }
};
  


  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendMessage();
    }
  };

  return (

    <div
  className="
    w-full
    h-full
    text-white
  "
>

      <div
        className="
          w-full
          h-full
          bg-[#111118]
          border
          border-white/10
          rounded-3xl
          flex
          flex-col
          overflow-hidden
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            px-4
            py-3
            border-b
            border-white/10
            flex
            items-center
            justify-between
            bg-[#15151d]
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-violet-500/20
                flex
                items-center
                justify-center
                text-xl
              "
            >
              🤖
            </div>

            <div>

              <h1 className="text-lg font-bold">
                AI Assistant
              </h1>

              <p className="text-xs text-white/40">
                Powered by Groq AI
              </p>

            </div>

          </div>

          <button
            onClick={createNewChat}
            className="
              px-3
              h-9
              rounded-xl
              bg-violet-600
              hover:bg-violet-500
              text-white
              text-sm
              transition-all
            "
          >
            + New Chat
          </button>

        </div>
        <button
  onClick={deleteAllChats}
  className="
    w-full
    mb-2
    py-2
    rounded-xl
    bg-red-500/10
    hover:bg-red-500/20
    text-red-300
    text-sm
    transition-all
  "
>
  🗑️ Delete All Chats
</button>

        {/* CHAT HISTORY */}

        <div
          className="
            border-b
            border-white/10
            p-2
            max-h-[300px]
            overflow-y-auto
            bg-[#111118]
          "
        >

          {chats.map((chat) => (

  <div
    key={chat.id}
    className="
      flex
      items-center
      gap-2
      mb-2
    "
  >

    {/* CHAT BUTTON */}

    <button
      onClick={() => openChat(chat.id)}
      className={`
        flex-1
        text-left
        px-3
        py-2
        rounded-xl
        text-sm
        transition-all
        truncate

        ${
          currentChatId === chat.id
            ? "bg-violet-600 text-white"
            : "bg-white/5 hover:bg-white/10"
        }
      `}
    >

      {chat.title}

    </button>

    <button
  onClick={() => renameChat(chat.id)}
  className="
    w-9
    h-9
    rounded-xl
    bg-blue-500/10
    hover:bg-blue-500/20
    text-blue-300
    flex
    items-center
    justify-center
  "
>

  ✏️

</button>

    {/* DELETE BUTTON */}

    <button
      onClick={() => deleteChat(chat.id)}
      className="
        w-9
        h-9
        rounded-xl
        bg-red-500/10
        hover:bg-red-500/20
        text-red-300
        hover:text-red-200
        flex
        items-center
        justify-center
        transition-all
        flex-shrink-0
      "
    >

      🗑️

    </button>
    

  </div>

))}

        </div>

        {/* MESSAGES */}

        <div
  ref={messagesContainerRef}
  className="
    flex-1
    overflow-y-auto
    px-4
    py-4
    space-y-4
    bg-[#0d0d14]
  "
>

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                  max-w-[85%]
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  break-words
                  shadow-lg
                  ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white rounded-br-md"
                      : "bg-white/10 text-white rounded-bl-md border border-white/5"
                  }
                `}
              >

                <div className="prose prose-invert prose-sm max-w-none">

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({
                        inline,
                        className,
                        children,
                        ...props
                      }) {

                        const match = /language-(\w+)/.exec(className || "");

                        return !inline && match ? (

                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >

                            {String(children).replace(/\n$/, "")}

                          </SyntaxHighlighter>

                        ) : (

                          <code className="bg-black/40 px-1 py-0.5 rounded">

                            {children}

                          </code>
                        );
                      },
                    }}
                  >

                    {msg.text}

                  </ReactMarkdown>

                </div>

                <div
                  className={`
                    text-[10px]
                    mt-2
                    ${
                      msg.sender === "user"
                        ? "text-violet-200"
                        : "text-white/40"
                    }
                  `}
                >

                  {msg.time}

                </div>

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div
                className="
                  bg-white/10
                  px-4
                  py-3
                  rounded-2xl
                  rounded-bl-md
                  text-sm
                  animate-pulse
                "
              >

                AI is thinking...

              </div>

            </div>

          )}


        </div>

        {/* INPUT */}

        <div
          className="
            p-4
            border-t
            border-white/10
            bg-[#15151d]
            flex
            gap-2
          "
        >

          <textarea
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="
              flex-1
              bg-black/30
              border
              border-white/10
              rounded-2xl
              p-3
              outline-none
              resize-none
              text-sm
              focus:border-violet-500/40
            "
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="
              bg-violet-600
              hover:bg-violet-500
              disabled:opacity-50
              px-5
              py-3
              rounded-2xl
              font-bold
              transition-all
              shadow-lg
            "
          >

            Send

          </button>

          <button
            onClick={clearChat}
            title="Clear Chat"
            className="
              w-10
              h-10
              rounded-xl
              bg-red-500/10
              hover:bg-red-500/20
              text-red-300
              hover:text-red-200
              flex
              items-center
              justify-center
              transition-all
              flex-shrink-0
            "
          >

            🗑️

          </button>

        </div>

      </div>

    </div>
  );
}

export default Chatbot;