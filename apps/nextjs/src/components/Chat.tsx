"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { ChatMessageIncoming } from "./ChatMessageIncoming";
import { ChatMessageOutcoming } from "./ChatMessageOutcoming";
import { ChatMessageSystem } from "./ChatMessageSystem";

interface MessageInterface {
  id: string;
  type: string;
  name?: string;
  message?: string;
  image?: string;
  createdAt: Date;
}

export function Chat({ chatId }: { chatId: string }) {
  const [inputMessage, setInputMessage] = useState("");

  //Public API that will echo messages sent to it back to the client n
  const [socketUrl, setSocketUrl] = useState(() => {
    const url = new URL(process.env.NEXT_PUBLIC_WS_URL || "");
    url.searchParams.append("chat_id", chatId);
    const dialogId = localStorage.getItem("dialogId");
    if (dialogId) {
      url.searchParams.append("chat_dialog_id", dialogId);
    }
    return url.href;
  });

  const [messageHistory, setMessageHistory] = useState([]);

  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scroll({
      top: divRef.current.scrollHeight,
      behavior: "smooth",
    });
  });

  const { sendMessage, sendJsonMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl, {
      shouldReconnect: (closeEvent) => true,
      onOpen: () => console.log("opened"),
      onMessage: (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chatDialogId") {
          localStorage.setItem("dialogId", message.value);
        }
        if (message.type === "chatDialogMessage") {
          setMessageHistory((prev) => prev.concat(message.data));
          console.log("message", message.data);
        }
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      share: true,
    });

  const handleClickSendMessage = useCallback(() => {
    sendJsonMessage({
      type: "chatText",
      text: inputMessage,
    });
    // sendMessage(inputMessage);
    setInputMessage("");
  }, [sendMessage, inputMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  function isOpen() {
    return readyState === ReadyState.OPEN;
  }

  const inputFileRef = useRef(null);

  const handleClickSelectFile = () => {
    // 👇️ open file input box on click of another element
    inputFileRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) {
      return;
    }

    const formData = new FormData();
    formData.append("image", fileObj);
    formData.append("fileName", fileObj.name);

    const respoonse = await fetch(
      process.env.NEXT_PUBLIC_CHAT_UPLOAD_IMAGE_URL || "",
      {
        method: "POST",
        body: formData,
      },
    );

    const res = (await respoonse.json()) as { imageUrl: string };

    console.log(res.imageUrl);

    sendJsonMessage({
      type: "chatImage",
      image: res?.imageUrl,
    });

    event.target.value = "";
  };

  return (
    <>
      <div>
        <div>
          <span>The WebSocket is currently {connectionStatus}</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="container mx-auto">
          <div className="flex h-[60vh] w-full flex-col rounded border shadow-lg">
            <div className="bg-grey-lighter flex flex-row items-center justify-between border-b px-3 py-2">
              <div className="flex items-center">
                <div>
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/bot-ava.png"
                    alt="Avatar of bot"
                  />
                </div>
                <div className="ml-4 text-left">
                  <p className="text-grey-darkest">Chatmebot</p>
                  <p className="text-grey-darker text-xs">I am AI chatbot</p>
                </div>
              </div>
              <div className="flex">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      fill="#263238"
                      fillOpacity=".5"
                      d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-6">
                  <button onClick={handleClickSelectFile}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        fill="#263238"
                        fillOpacity=".5"
                        d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                      ></path>
                    </svg>
                  </button>
                  <input
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      fill="#263238"
                      fillOpacity=".6"
                      d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            {/* messages */}
            <div ref={divRef} className="flex-1 overflow-auto">
              <div className="flex flex-col gap-2 px-3 py-4">
                {messageHistory.map((message: MessageInterface) => {
                  if (message.type === "in") {
                    return (
                      <ChatMessageIncoming
                        name={message.name}
                        createdAt={message.createdAt}
                        image={message.image}
                        key={message.id}
                      >
                        {message.message}
                      </ChatMessageIncoming>
                    );
                  } else if (message.type === "system") {
                    return (
                      <ChatMessageSystem key={message.id}>
                        {message.message}
                      </ChatMessageSystem>
                    );
                  } else if (message.type === "out") {
                    return (
                      <ChatMessageOutcoming
                        key={message.id}
                        image={message.image}
                        createdAt={message.createdAt}
                      >
                        {message.message}
                      </ChatMessageOutcoming>
                    );
                  } else {
                    return <>unknow message</>;
                  }
                })}
              </div>
            </div>
            <div>
              <div className="flex gap-2 border-t px-4 py-4">
                <div className="flex flex-1 items-center">
                  <TextareaAutosize
                    className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                    value={inputMessage}
                    maxRows={5}
                    onChange={(ev) => {
                      setInputMessage(ev.target.value);
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <div>
                    <button
                      disabled={inputMessage === "" || !isOpen()}
                      onClick={handleClickSendMessage}
                      className="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 
            <div className="bg-grey-lighter flex items-center px-4 py-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    opacity=".45"
                    fill="#263238"
                    d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                  ></path>
                </svg>
              </div>
              <div className="mx-4 flex-1">
                <input
                  className="w-full rounded border px-2 py-2"
                  type="text"
                />
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="#263238"
                    fillOpacity=".45"
                    d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
                  ></path>
                </svg>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

// return (
//   <>
//     <div>
//       <div className="container mx-auto">
//         <div className="flex h-96 w-full flex-col rounded border shadow-lg">
//           <div className="bg-grey-lighter flex flex-row items-center justify-between border-b px-3 py-2">
//             <div className="flex items-center">
//               <div>
//                 <img
//                   className="h-10 w-10 rounded-full"
//                   src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"
//                 />
//               </div>
//               <div className="ml-4">
//                 <p className="text-grey-darkest">New Movie! Expendables 4</p>
//                 <p className="text-grey-darker mt-1 text-xs">
//                   Andrés, Tom, Harrison, Arnold, Sylvester
//                 </p>
//               </div>
//             </div>
//             <div className="flex">
//               <div>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   width="24"
//                   height="24"
//                 >
//                   <path
//                     fill="#263238"
//                     fillOpacity=".5"
//                     d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="ml-6">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   width="24"
//                   height="24"
//                 >
//                   <path
//                     fill="#263238"
//                     fillOpacity=".5"
//                     d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="ml-6">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   width="24"
//                   height="24"
//                 >
//                   <path
//                     fill="#263238"
//                     fillOpacity=".6"
//                     d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
//                   ></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//           {/* messages */}
//           <div className="flex-1 overflow-auto">
//             <div className="flex flex-col gap-2 px-3 py-4">
//               {messages.map((message) => {
//                 if (message.type === "in") {
//                   return (
//                     <ChatMessageIncoming
//                       name={message.name}
//                       createdAt={message.createdAt}
//                       key={message.id}
//                     >
//                       {message.text}
//                     </ChatMessageIncoming>
//                   );
//                 } else if (message.type === "system") {
//                   return (
//                     <ChatMessageSystem key={message.id}>
//                       {message.text}
//                     </ChatMessageSystem>
//                   );
//                 } else if (message.type === "out") {
//                   return (
//                     <ChatMessageOutcoming
//                       key={message.id}
//                       createdAt={message.createdAt}
//                     >
//                       {message.text}
//                     </ChatMessageOutcoming>
//                   );
//                 } else {
//                   return <>unknow message</>;
//                 }
//               })}
//             </div>
//           </div>

//           <form onSubmit={onSubmitHandler}>
//             <div className="flex gap-2 border-t px-4 py-4">
//               <div className="flex-1">
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   rows={3}
//                   name="comment"
//                   id="comment"
//                   className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
//                   placeholder="Add your comment..."
//                 />
//               </div>
//               <div className="flex items-end">
//                 <div>
//                   <button
//                     type="submit"
//                     className="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="h-6 w-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>

//           {/* <div className="bg-grey-lighter flex items-center px-4 py-4">
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="24"
//                 height="24"
//               >
//                 <path
//                   opacity=".45"
//                   fill="#263238"
//                   d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
//                 ></path>
//               </svg>
//             </div>
//             <div className="mx-4 flex-1">
//               <input
//                 className="w-full rounded border px-2 py-2"
//                 type="text"
//               />
//             </div>
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="24"
//                 height="24"
//               >
//                 <path
//                   fill="#263238"
//                   fillOpacity=".45"
//                   d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
//                 ></path>
//               </svg>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   </>
// );
// }
