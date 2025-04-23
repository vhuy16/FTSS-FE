import { useAppDispatch, useAppSelector } from "@redux/hook";
import { Input } from "@styles/form";
import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { RiCloseLine, RiCustomerService2Fill } from "react-icons/ri";
import { subscribeToRoomMessages } from "realtime/supabaseListeners";
import { CreateChatofUser, CreateChatRoom, getRoomDetail } from "@redux/slices/chatSlice";

const ChatboxWidget = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const chatMessages = useAppSelector((state) => state.chat.chat);
  const [inputMessage, setInputMessage] = useState("");
  const [hasNotification, setHasNotification] = useState(true);
  const userId = localStorage.getItem("userId");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const managerID = "cab3c1e8-2997-4059-9454-13a49184ca74";
  const [roomId, setRoomId] = useState<string | null>(null);
  const [pendingMessages, setPendingMessages] = useState<{ id: string; text: string; files: File[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!managerID) return;

    const getOrCreateRoom = async () => {
      // Kiểm tra localStorage trước
      const savedRoomId = localStorage.getItem("roomId");
      if (savedRoomId) {
        setRoomId(savedRoomId);
        return;
      }

      try {
        const res = await dispatch(CreateChatRoom({ managerId: managerID })).unwrap();
        console.log("ressroom", res);

        if (res?.id) {
          setRoomId(res.id);
          localStorage.setItem("roomId", res.id); // Lưu lại để dùng lại sau
        }
      } catch (err) {
        console.error("Không thể tạo hoặc lấy roomId:", err);
      }
    };

    getOrCreateRoom();
  }, [managerID, dispatch]);

  //kiem tra thong bao
  useEffect(() => {
    if (!isOpen && chatMessages.length > 0) {
      setHasNotification(true);
    }
  }, [chatMessages]);

  // Lắng nghe tin nhắn mới từ Supabase khi mở chatbox
  useEffect(() => {
    if (roomId) {
      dispatch(getRoomDetail(roomId));
      const channel = subscribeToRoomMessages(roomId, dispatch);
      return () => {
        channel && channel.unsubscribe(); // hoặc `supabase.removeChannel(channel);`
      };
    }
  }, [roomId]);

  // Cuộn đến cuối khi mở chatbox hoặc có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, chatMessages]); // Tự động cuộn xuống khi có tin nhắn mới

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && mediaFiles.length === 0) || !roomId || !userId) return;

    const tempId = Date.now().toString(); // ID tạm thời để render
    const optimisticMsg = {
      id: tempId,
      text: inputMessage,
      files: mediaFiles,
    };
    // Thêm tin nhắn vào pending để hiển thị ngay
    setPendingMessages((prev) => [...prev, optimisticMsg]);
    setInputMessage("");
    setMediaFiles([]);
    // Gửi tin nhắn vào Supabase
    dispatch(CreateChatofUser({ text: optimisticMsg.text, roomId, files: optimisticMsg.files }))
      .unwrap()
      .then(() => {
        // Gỡ bỏ tin nhắn tạm khỏi danh sách
        setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      })
      .catch((error) => {
        console.error("Gửi tin nhắn thất bại:", error);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prevFiles) => [...prevFiles, ...filesArray]); // Thêm các tệp mới vào mảng
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Xóa tệp theo chỉ mục
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-3/4 right-15 md:w-[400px] md:h-[600px] lg:w-[480px] lg:h-[700px] bg-gray-100 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#10ac97] h-[60px] flex items-center justify-between px-4">
            <div className="flex items-center">
              <RiCustomerService2Fill className="text-white text-2xl mr-2" />
              <h3 className="text-white font-bold text-lg">Hỗ trợ khách hàng</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <RiCloseLine className="text-2xl" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <>
              {/* ✅ Tin nhắn đã gửi từ server */}
              {chatMessages?.map((msg, index) => (
                <div key={index} className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}>
                  {msg.userId !== userId && (
                    <div className="w-10 h-10 rounded-full bg-[#10ac97] flex items-center justify-center mr-2">
                      <RiCustomerService2Fill className="text-white text-lg" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-[80%] space-y-2">
                    <div
                      className={`p-4 rounded-2xl ${
                        msg.userId === userId
                          ? "bg-[#10ac97] text-white self-end"
                          : "bg-gray-100 text-gray-800 self-start"
                      }`}
                    >
                      {msg.text}
                    </div>
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
                  </div>
                </div>
              ))}

              {/* ✅ Tin nhắn đang chờ gửi */}
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
            {/* Scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>
          {/* Hiển thị danh sách ảnh/video đã chọn */}
          {mediaFiles.length > 0 && (
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
              <input
                type="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                multiple // Cho phép chọn nhiều file
              />
              <label
                htmlFor="file-input"
                className="bg-[#10ac97] hover:bg-[#1d8a66] text-white rounded-full w-11 h-11 flex items-center justify-center cursor-pointer"
              >
                <span className="text-xl">+</span>
              </label>
              <button
                onClick={handleSendMessage}
                className="bg-[#10ac97] hover:bg-[#1d8a66] text-white rounded-full w-11 h-11 flex items-center justify-center"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen(true);
          setHasNotification(false); // mở chat là tắt badge
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
