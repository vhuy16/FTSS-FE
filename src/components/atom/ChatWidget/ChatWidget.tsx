import { useAppDispatch, useAppSelector } from "@redux/hook";
import { Input } from "@styles/form";
import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { RiCloseLine, RiCustomerService2Fill } from "react-icons/ri";
import { subscribeToRoomMessages } from "realtime/supabaseListeners";
import { CreateChatofUser, CreateChatRoom, getRoomDetail } from "@redux/slices/chatSlice";
import { Order } from "@redux/slices/orderListSlice";
import { sendChatbotAlMessage, clearChatResponse } from "@redux/slices/chatbotAlSlice"; // Import action
import { formatDate } from "@ultils/helper";
import { BookingList } from "@redux/slices/bookingSlice";

interface ChatboxWidgetProps {
  order?: Order | null;
  booking?: BookingList | null;
  isOpen: boolean;
  onClose: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatboxWidget = ({ isOpen, onClose, order, setIsOpen, booking }: ChatboxWidgetProps) => {
  const dispatch = useAppDispatch();
  const chatMessages = useAppSelector((state) => state.chat.chat);
  const { data: aiResponse, loading: aiLoading, error: aiError } = useAppSelector((state) => state.chatbot); // Lấy trạng thái từ chatbotAlSlice
  const [inputMessage, setInputMessage] = useState("");
  const [hasNotification, setHasNotification] = useState(true);
  const userId = localStorage.getItem("userId");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const managerID = "cab3c1e8-2997-4059-9454-13a49184ca74";
  const [roomId, setRoomId] = useState<string | null>(null);
  const [pendingMessages, setPendingMessages] = useState<{ id: string; text: string; files: File[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatMode, setChatMode] = useState<"ai" | "employee" | null>(null);
  const [aiMessages, setAiMessages] = useState<{ id: string; text: string; sender: "user" | "ai" }[]>([]);
  console.log("almess", aiMessages);

  // Logic cho chế độ Tư vấn viên
  useEffect(() => {
    if (chatMode !== "employee" || !managerID) return;

    const getOrCreateRoom = async () => {
      // const savedRoomId = localStorage.getItem("roomId");
      // if (savedRoomId) {
      //   setRoomId(savedRoomId);
      //   return;
      // }
      try {
        const res = await dispatch(CreateChatRoom({ managerId: managerID })).unwrap();
        if (res?.id) {
          setRoomId(res.id);
          // localStorage.setItem("roomId", res.id);
        }
      } catch (err) {
        console.error("Không thể tạo hoặc lấy roomId:", err);
      }
    };

    getOrCreateRoom();
  }, [managerID, dispatch, chatMode]);

  useEffect(() => {
    if (!isOpen && chatMessages.length > 0) {
      setHasNotification(true);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatMode === "employee" && roomId) {
      console.log("Calling getRoomDetail for room:", roomId);
      dispatch(getRoomDetail(roomId)).then((res) => {
        console.log("room:", res);
      });
      const channel = subscribeToRoomMessages(roomId, dispatch);
      return () => {
        console.log("Unsubscribing from room:", roomId);
        channel?.unsubscribe();
      };
    }
  }, [roomId, chatMode, dispatch]);
  useEffect(() => {
    if (order || booking) {
      setIsOpen(true);
      setHasNotification(false);
      setChatMode("employee");
    }
  }, [order, booking]);

  useEffect(() => {
    if (order && isOpen && chatMode == "employee") {
      const orderInfo = `Báo cáo đơn hàng #${order.oderCode}`;
      setInputMessage(orderInfo);
    }
    if (booking && isOpen && chatMode == "employee") {
      const bookingInfo = `Báo cáo đơn bảo trì #${booking.bookingCode}`;
      setInputMessage(bookingInfo);
    }
  }, [order, isOpen, chatMode, booking]);

  useEffect(() => {
    if (isOpen && chatMode) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, chatMessages, aiMessages, chatMode]);
  useEffect(() => {
    if (chatMode === "ai" && aiMessages.length === 0) {
      const welcomeMessage = {
        id: "welcome-" + Date.now(),
        text: "Chào bạn! Mình là Trợ lý AI được tạo ra để trợ giúp bạn tìm hiểu các nội dung liên quan đến các vấn đề của hồ cá và cá. Bạn đang cần hỗ trợ về vấn đề gì?",
        sender: "ai" as const,
      };
      setAiMessages([welcomeMessage]);
    }
  }, [chatMode]);
  // Cập nhật tin nhắn AI khi nhận phản hồi từ slice
  useEffect(() => {
    if (chatMode === "ai" && aiResponse && !aiLoading) {
      const userMsg = aiMessages.find((msg) => msg.sender === "user");
      if (userMsg) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          text: `${aiResponse.response}\n${aiResponse.tip ? `Mẹo: ${aiResponse.tip}` : ""}`,
          sender: "ai" as const,
        };
        setAiMessages((prev) => [...prev, aiMsg]);
        dispatch(clearChatResponse()); // Xóa phản hồi cũ sau khi hiển thị
      }
    }
  }, [aiResponse, aiLoading, chatMode]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };
  const handleSendMessage = () => {
    if (!userId || (!inputMessage.trim() && mediaFiles.length === 0)) return;
    if (chatMode === "ai") {
      // Gửi tin nhắn qua Redux action
      const userMsg = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: "user" as const,
      };
      setAiMessages((prev) => [...prev, userMsg]);
      setInputMessage("");
      dispatch(sendChatbotAlMessage(inputMessage));
    } else if (chatMode === "employee") {
      if (!roomId) return;

      const tempId = Date.now().toString();
      const optimisticMsg = {
        id: tempId,
        text: inputMessage,
        files: mediaFiles,
      };
      setPendingMessages((prev) => [...prev, optimisticMsg]);
      setInputMessage("");
      setMediaFiles([]);

      dispatch(CreateChatofUser({ text: optimisticMsg.text, roomId, files: optimisticMsg.files }))
        .unwrap()
        .then(() => {
          setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        })
        .catch((error) => {
          console.error("Gửi tin nhắn thất bại:", error);
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-3/4 right-15 md:w-[400px] md:h-[600px] lg:w-[480px] lg:h-[700px] bg-gray-100 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#10ac97] h-[60px] flex items-center justify-between px-4">
            <div className="flex items-center">
              <RiCustomerService2Fill className="text-white text-2xl mr-2" />
              <h3 className="text-white font-bold text-lg">
                {chatMode ? (chatMode === "ai" ? "Trợ lý AI" : "Hỗ trợ khách hàng") : "Trợ lý AI"}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          {!chatMode ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#10ac97] flex items-center justify-center mr-2">
                  <RiCustomerService2Fill className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold">Chào bạn! Mình là Trợ lý AI được tạo ra để hỗ trợ bạn.</h3>
              </div>
              <p className="text-gray-600 text-center">Bạn đang cần hỗ trợ về vấn đề gì?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setChatMode("ai")}
                  className="px-4 py-2 bg-[#10ac97] text-white rounded-lg hover:bg-[#1d8a66]"
                >
                  Trợ lý AI
                </button>
                <button
                  onClick={() => setChatMode("employee")}
                  className="px-4 py-2 bg-[#10ac97] text-white rounded-lg hover:bg-[#1d8a66]"
                >
                  Tư vấn viên
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center p-2 bg-gray-200">
                <button
                  onClick={() => setChatMode("ai")}
                  className={`px-4 py-2 rounded-l-lg ${chatMode === "ai" ? "bg-[#10ac97] text-white" : "bg-gray-300"}`}
                >
                  Trợ lý AI
                </button>
                <button
                  onClick={() => setChatMode("employee")}
                  className={`px-4 py-2 rounded-r-lg ${
                    chatMode === "employee" ? "bg-[#10ac97] text-white" : "bg-gray-300"
                  }`}
                >
                  Tư vấn viên
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMode === "ai" ? (
                  <>
                    {aiMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.sender !== "user" ? (
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            <div className="w-10 h-10 rounded-full bg-[#10ac97] flex items-center justify-center mr-2">
                              <RiCustomerService2Fill className="text-white text-lg" />
                            </div>
                            <div
                              className={`p-4 rounded-2xl ${
                                msg.sender === "ai"
                                  ? "bg-white text-gray-800 self-start"
                                  : "bg-[#10ac97] text-white self-end"
                              } max-w-[80%] whitespace-pre-line`}
                              dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-[#10ac97] text-white self-end max-w-[80%] break-words">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 bg-white text-gray-800 rounded-2xl">Đang xử lý...</div>
                      </div>
                    )}
                    {aiError && (
                      <div className="flex justify-start">
                        <div className="p-4 bg-red-100 text-red-800 rounded-2xl">{aiError}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {chatMessages?.map((msg, index) => (
                      <div key={index} className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}>
                        {msg.userId !== userId && (
                          <div className="w-10 h-10 rounded-full bg-[#10ac97] flex items-center justify-center mr-2">
                            <RiCustomerService2Fill className="text-white text-lg" />
                          </div>
                        )}
                        <div className="flex flex-col max-w-[80%] space-y-2">
                          {msg.text && (
                            <div
                              className={`p-4 rounded-2xl ${
                                msg.userId === userId
                                  ? "bg-[#10ac97] text-white self-end"
                                  : "bg-white text-gray-800 self-start"
                              }`}
                            >
                              {msg.text}
                            </div>
                          )}
                          {msg.media && msg.media.length > 0 && (
                            <div className={`${msg.userId === userId ? "self-end" : "self-start"}`}>
                              {msg.media.map((mediaItem, idx) => (
                                <div key={idx} className="mb-2">
                                  {mediaItem.type === "image" ? (
                                    <img src={mediaItem.url} alt="Media" className="max-w-full h-auto rounded-lg" />
                                  ) : mediaItem.type === "video" ? (
                                    <video controls className="max-w-full h-auto rounded-lg">
                                      <source src={mediaItem.url} type="video/mp4" />
                                    </video>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-gray-400">{formatDate(msg.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                    {pendingMessages.map((msg, index) => (
                      <div key={`pending-${msg.id}`} className="flex justify-end">
                        <div className="flex flex-col max-w-[80%] space-y-1">
                          <div className="bg-[#10ac97] text-white p-4 rounded-2xl self-end">{msg.text}</div>
                          {msg.files.length > 0 && (
                            <div className="self-end">
                              {msg.files.map((file, idx) => (
                                <div key={idx} className="mb-2">
                                  {file.type.startsWith("image") ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt="Media"
                                      className="max-w-full h-auto rounded-lg"
                                    />
                                  ) : file.type.startsWith("video") ? (
                                    <video controls className="max-w-full h-auto rounded-lg">
                                      <source src={URL.createObjectURL(file)} />
                                    </video>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="text-sm text-gray-500 italic self-end">⏳ Đang gửi...</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {chatMode === "employee" && mediaFiles.length > 0 && (
                <div className="p-4 space-y-2 border-t">
                  <h4 className="font-semibold">Ảnh / Video :</h4>
                  <div className="flex gap-2 flex-wrap">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative">
                        {file.type.startsWith("image") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : file.type.startsWith("video") ? (
                          <video controls className="w-16 h-16 object-cover rounded-lg">
                            <source src={URL.createObjectURL(file)} />
                          </video>
                        ) : null}
                        <button
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {chatMode === "employee" && (
                    <>
                      <input
                        type="file"
                        accept="image/*, video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input"
                        multiple
                      />
                      <label
                        htmlFor="file-input"
                        className="bg-[#10ac97] hover:bg-[#1d8a66] text-white rounded-full w-11 h-11 flex items-center justify-center cursor-pointer"
                      >
                        <span className="text-xl">+</span>
                      </label>
                    </>
                  )}
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#10ac97] hover:bg-[#1d8a66] text-white rounded-full w-11 h-11 flex items-center justify-center"
                  >
                    <FiSend className="text-lg" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen(true);
          setHasNotification(false);
        }}
        className="relative w-[60px] h-[60px] bg-[#10ac97] hover:bg-[#10ac97] rounded-full shadow-lg flex items-center justify-center"
      >
        <RiCustomerService2Fill className="text-white text-2xl" />
        {hasNotification && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
      </button>
    </div>
  );
};

export default ChatboxWidget;
