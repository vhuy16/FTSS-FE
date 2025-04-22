import { useAppDispatch, useAppSelector } from "@redux/hook";
import { CreateChat, CreateChatRoom, getAllChatofUser } from "@redux/slices/chatUserSlice";
import { Input } from "@styles/form";
import { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { RiCloseLine, RiCustomerService2Fill } from "react-icons/ri";
import Loading from "../Loading/Loading";

const ChatboxWidget = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const chatMessages = useAppSelector((state) => state.chatUser.chat);
  const isLoadingMessages = useAppSelector((state) => state.chatUser.isLoadingGetAllChat);
  const [inputMessage, setInputMessage] = useState("");
  const [hasNotification, setHasNotification] = useState(true);
  const userId = localStorage.getItem("userId");
  const roomId = "784e5baa-dd74-498d-8f97-d0fa5dbd7fda";
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllChatofUser({ roomId }));
    }
  }, [isOpen]);
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    dispatch(CreateChat({ roomId, text: inputMessage }));
    setInputMessage("");
  };
  console.log("chat", chatMessages);
  console.log("room", roomId);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[410px] h-[550px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#6C4EFF] h-[60px] flex items-center justify-between px-4">
            <div className="flex items-center">
              <RiCustomerService2Fill className="text-white text-2xl mr-2" />
              <h3 className="text-white font-bold text-lg">Hỗ trợ khách hàng</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingMessages ? (
              <Loading></Loading>
            ) : (
              chatMessages?.map((msg, index) => (
                <div key={index} className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}>
                  {msg.userId !== userId && (
                    <div className="w-10 h-10 rounded-full bg-[#6C4EFF] flex items-center justify-center mr-2">
                      <RiCustomerService2Fill className="text-white text-lg" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.userId === userId ? "bg-[#6C4EFF] text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-full px-4 py-2"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#6C4EFF] hover:bg-[#5B3FD9] text-white rounded-full w-11 h-11 flex items-center justify-center"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative w-[60px] h-[60px] bg-[#6C4EFF] hover:bg-[#5B3FD9] rounded-full shadow-lg flex items-center justify-center"
      >
        <RiCustomerService2Fill className="text-white text-2xl" />
      </button>
    </div>
  );
};

export default ChatboxWidget;
