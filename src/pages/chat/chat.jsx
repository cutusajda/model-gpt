import "./chat.css";
import { Player } from "@lordicon/react";
import Plus from "../../assets/plus.png";
import Home from "../../assets/home.svg";
import SendBtn from "../../assets/send.svg";
import GPTLogo from "../../assets/logo.png";
import APIService from "../../services/gpt";
import Menu from "../../assets/category.json";
import Upgrade from "../../assets/rocket.svg";
import UserIcon from "../../assets/user-icon.jpg";
import MessageIcon from "../../assets/message.svg";
import {
  faCircleChevronDown,
  faCircleChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const Chat = () => {
  const messageEnd = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  let chat_template = {
    id: 0,
    title: "Untitled Chat",
    message: [
      {
        text: "Hi I'm Cutu GPT, Handmade by Sajda Parveen",
        isBot: true,
      },
    ],
  };

  const [query, setQuery] = useState([chat_template]);

  // State to Change Load and Unload Loader
  const [isLoading, setIsLoading] = useState(false);

  const [activeChat, isActive] = useState(0);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClick = async () => {
    const text = inputValue;

    setInputValue("");
    setMessages([...messages, { text, isBot: false }]);

    setIsLoading(true); // Set loading state to true before API call

    // Closing Mobile Navbar Menu
    setIsOpen(false)

    const data = await APIService(inputValue);
    setIsLoading(false); // Set loading state to false after API call
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: data ? data : "Try again later", isBot: true },
    ]);

    // Set Message to Local Storage
    let local_storage_chat = JSON.parse(localStorage.getItem("chat"));

    let user_message = {
      text: inputValue,
      isBot: false,
    };

    let bot_message = {
      text: data ? data : "Try again later",
      isBot: true,
    };

    let active_message = local_storage_chat[activeChat];
    if (active_message.message.length === 1) {
      active_message.title = inputValue;
    }
    
    active_message.message.push(user_message);
    active_message.message.push(bot_message);
    localStorage.setItem("chat", JSON.stringify(local_storage_chat));
    setQuery(local_storage_chat);
  };

  useEffect(() => {
    if (messages.length > 1) {
      messageEnd.current.scrollIntoView();
    }
  }, [messages]);

  useLayoutEffect(() => {
    let local_storage_chat = localStorage.getItem("chat");

    if (!local_storage_chat) {
      let untitled_chat = [
        {
          id: 0,
          title: "Untitled Chat",
          message: [
            {
              text: "Hi I'm Cutu GPT, Handmade by Sajda Parveen",
              isBot: true,
            },
          ],
        },
      ];

      untitled_chat = JSON.stringify(untitled_chat);
      localStorage.setItem("chat", untitled_chat);

      local_storage_chat = JSON.parse(localStorage.getItem("chat"));
      setQuery(local_storage_chat);
      isActive(local_storage_chat.slice(-1).id);
      handleSelectChat(0);
      return;
    }

    local_storage_chat = JSON.parse(local_storage_chat);
    setQuery((prev) => local_storage_chat);
    handleSelectChat(local_storage_chat.slice(-1)[0].id);
  }, []);

  const handleEnter = async (e) => {
    if (e.key === "Enter") await handleClick();
  };

  const handleAdddNewChat = () => {
    let local_storage_chats = JSON.parse(localStorage.getItem("chat"));
    let last_id = local_storage_chats.slice(-1)[0].id;
    chat_template.id = last_id + 1;

    let last_chat_length = local_storage_chats.slice(-1)[0].message.length;

    if (last_chat_length <= 1) {
      return;
    }

    setQuery((prev) => {
      let updatedQuery = [...prev, chat_template];
      let old_chats = JSON.parse(localStorage.getItem("chat"));

      old_chats.push(chat_template);
      localStorage.setItem("chat", JSON.stringify(old_chats));

      // Change Active Chat When New Chat Created
      handleSelectChat(last_id + 1)

      // Set Scroll Chat To End False When New Chat Is Created
      messageEnd.current.scrollIntoView(false);
      return updatedQuery;
    });

    isActive(last_id);
  };

  // Function To Show Selected Chats in Chats Body
  const handleSelectChat = (i) => {
    let local_storage_chats = JSON.parse(localStorage.getItem("chat"));
    setMessages(local_storage_chats[i].message);
    isActive(i);

    // Set Scroll Chat To End False When A Chat Is Selected
    messageEnd.current.scrollIntoView(false);
  };

  const playerRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(false);

  const onPlayPress = () => {
    playerRef.current?.playFromBeginning();
    setIsOpen(!isOpen);
  };

  const onSubMenuPress = () => {
    setSubMenu(!subMenu);
  };

  const clearChats = () => {
    if (window.confirm('Are you sure to delete all chats?')) {
      localStorage.removeItem("chat");
      window.location.reload();
    }
  }

  return (
    <>
      <div className="container">
        <nav className="mobile-navbar">
          <div className="nav-left">
            <img src={GPTLogo} alt="GPT LOGO" className="logo" />
            <span className="brand">CutuGPT</span>
          </div>
          <div className="nav-right">
            <div onClick={onPlayPress}>
              <Player ref={playerRef} icon={Menu} />
            </div>
            {isOpen && (
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-items">
                  <p>Home</p>
                </div>

                <div className="mobile-dropdown-items">
                  <div
                    className="mobile-dropdown-subitem"
                    onClick={onSubMenuPress}
                  >
                    <p>Recent</p>
                    {subMenu && <FontAwesomeIcon icon={faCircleChevronUp} />}
                    {!subMenu && <FontAwesomeIcon icon={faCircleChevronDown} />}
                  </div>

                  {subMenu && (
                    <div className="mobile-dropdown-submenu">
                      {query.map((message, i) => (
                        <div
                          key={i}
                          className="recent-query"
                          onClick={() => handleSelectChat(i)}
                        >
                          <p>{message.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="mobile-dropdown-items"
                  onClick={handleAdddNewChat}
                >
                  <p>New Chat</p>
                </div>
                <div
                  className="mobile-dropdown-items"
                  onClick={clearChats}
                >
                  <p>Clear Chat</p>
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className="sidebar">
          <div className="upperSide">
            <div className="upperSideTop">
              <img src={GPTLogo} alt="GPT LOGO" className="logo" />
              <span className="brand">CutuGPT</span>
            </div>
            <button className="midBtn" onClick={handleAdddNewChat}>
              <img src={Plus} alt="New Chat" className="addBtn" />
              New Chat
            </button>
            <div className="upperSideBottom">
              {query.map((message, i) => (
                <div
                  key={i}
                  className="query"
                  onClick={() => handleSelectChat(i)}
                >
                  <img src={MessageIcon} alt="Previous Chats" />
                  <p>{message.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lowerSide">
            <div className="listItems">
              <img src={Home} alt="" className="listItemsImg" /> Home
            </div>
            <div className="listItems">
              <img src={Upgrade} alt="" className="listItemsImg" /> Clear Recent
            </div>
          </div>
        </div>
        <div className="main">
          <div className="chats">
            {messages.map((message, i) => (
              <div key={i} className={message.isBot ? "chat gpt" : "chat"}>
                <img
                  className="chatImg"
                  src={message.isBot ? GPTLogo : UserIcon}
                  alt=""
                />
                <p className="txt">{message.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className={"chat gpt loading-container"}>
                <img className="chatImg" src={GPTLogo} alt="" />
                <div className="loader"></div>
              </div>
            )}
            <div ref={messageEnd} />
          </div>
          <div className="chatFooter">
            <div className="inp">
              <input
                type="text"
                placeholder="Type a message..."
                onChange={handleChange}
                value={inputValue}
                onKeyDown={handleEnter}
              />
              <button className="send" onClick={handleClick}>
                <img src={SendBtn} alt="Send" className="sendBtn" />
              </button>
            </div>
            <p>
              Cutu GPT | Ver. 0.0.1 by Sajda Parveen is just for demonstrating
              purposes. Don't use this for enterprice solutions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
