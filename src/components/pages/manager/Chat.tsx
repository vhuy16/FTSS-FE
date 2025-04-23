import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic, BsSend } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import PageBreadcrumb from '@common/PageBreadCrumb';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { createChat, getAllRoom, getRoomDetail, Room, selectRoom } from '@redux/slices/chatSlice';
import LoadingPage from '@components/atom/Loading/LoadingPage';
import Avatar from '@components/atom/header/Avatar';
import { subscribeToRoomChanges, subscribeToRoomMessages } from 'realtime/supabaseListeners';
import { FiPlusCircle, FiSend } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPlayFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Loading from '@components/atom/Loading/Loading';

const Chat = () => {
    const dispatch = useAppDispatch();
    const rooms = useAppSelector((state) => state.chat.rooms);
    const selectedRoom = useAppSelector((state) => state.chat.selectedRoom);
    const chat = useAppSelector((state) => state.chat.chat);
    const isLoading = useAppSelector((state) => state.chat.isLoadingRooms);
    const isLoadingAdd = useAppSelector((state) => state.chat.isLoadingAdd);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState('');
    const [listRooms, setListRooms] = useState<Room[]>([]);
    useEffect(() => {
        dispatch(getAllRoom());
        const channel = subscribeToRoomChanges(dispatch);
        return () => {
            channel && channel.unsubscribe();
        };
    }, []);
    useEffect(() => {
        dispatch(selectRoom(rooms[0]));
        setListRooms(rooms);
    }, [rooms]);
    useEffect(() => {
        if (value === '') {
            setListRooms(rooms);
        } else {
            setListRooms(rooms.filter((room) => room.customerName.includes(value)));
        }
    }, [value]);
    useEffect(() => {
        if (selectedRoom) {
            dispatch(getRoomDetail(selectedRoom.id));
            const channel = subscribeToRoomMessages(selectedRoom.id, dispatch);
            return () => {
                channel && channel.unsubscribe(); // hoặc `supabase.removeChannel(channel);`
            };
        }
    }, [selectedRoom]);
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView();
        }
    }, [chat]);
    type MediaFile = {
        file: File;
        preview: string;
        type: 'image' | 'video';
    };
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<MediaFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

        const validFiles: MediaFile[] = selectedFiles
            .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
            .map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 'video',
            }));

        setFiles((prev) => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleSend = async () => {
        if (message.trim() || files.length > 0) {
            try {
                const formData = new FormData();
                formData.append('RoomId', selectedRoom.id);
                if (message.trim()) {
                    formData.append('Text', message);
                } else {
                    formData.append('Text', '');
                }
                if (files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        formData.append('Files', files[i].file);
                    }
                } else {
                    formData.append('Files', '');
                }
                const res = await dispatch(createChat(formData)).unwrap();
                if (res?.id) {
                    setMessage('');
                    setFiles([]);
                }
            } catch (error) {
                toast.error(error as string);
            }
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Tin nhắn" />
            {isLoading ? (
                <LoadingPage></LoadingPage>
            ) : (
                <div className="space-y-6" style={{ height: '80vh' }}>
                    <div className="flex h-full bg-[#F9FAFB] p-6 font-sans">
                        {/* Sidebar */}
                        <div className="hidden md:flex flex-col w-80 bg-white rounded-xl shadow-sm mr-6 rounded-2xl border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 max-h-32"
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-y-3 p-3">
                                    {listRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${
                                                room.id === selectedRoom?.id ? 'bg-gray-100' : 'hover:bg-gray-100'
                                            }`}
                                            onClick={() => dispatch(selectRoom(room))}
                                        >
                                            <div className="relative">
                                                <div className="relative h-12 w-12 max-w-[48px] rounded-full">
                                                    <Avatar name={room?.customerName as string}></Avatar>
                                                </div>
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                        {room.customerName}
                                                    </h3>
                                                    <span className="text-xs text-gray-400">
                                                        {room.latestMessageTime.split('T')[0]} lúc
                                                        {room.latestMessageTime.split('T')[1]}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">Khách hàng</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col bg-white shadow-sm overflow-hidden rounded-2xl border border-gray-200">
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <div className="relative h-12 w-12 max-w-[48px] rounded-full">
                                            <Avatar name={chat && chat.length > 0 ? chat[0].username : ''} />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-sm font-semibold text-gray-800">
                                            {chat && chat.length > 0 ? chat[0].username : ''}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <BsThreeDotsVertical className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] ml-4 cursor-pointer" />
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <div className="space-y-4">
                                    {chat?.length > 0 &&
                                        chat.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex gap-4 ${
                                                    message.role === 'Manager' ? 'justify-end pr-1' : 'items-start'
                                                }`}
                                            >
                                                {message.role === 'Customer' && (
                                                    <div className="relative h-10 w-10 max-w-[48px] rounded-full">
                                                        <Avatar name={message.username ?? ''}></Avatar>
                                                    </div>
                                                )}
                                                <div
                                                    className={`w-full flex flex-col ${
                                                        message.role === 'Manager' ? 'items-end' : 'items-start'
                                                    }`}
                                                >
                                                    {message?.media?.length > 0 &&
                                                        message?.media.map((file) =>
                                                            file.type === 'image' ? (
                                                                <img
                                                                    src={file.url}
                                                                    alt="Shared content"
                                                                    className="max-w-[70%] rounded-xl mb-1"
                                                                />
                                                            ) : (
                                                                <video
                                                                    src={file.url}
                                                                    controls
                                                                    className="max-w-[70%] rounded-xl mb-1"
                                                                />
                                                            ),
                                                        )}
                                                    <div
                                                        className={`px-4 py-2 rounded-xl max-w-[70%] ${
                                                            message.role === 'Manager'
                                                                ? 'bg-[#4F46E5] text-white'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        <p className="text-sm leading-5">{message.text}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {message.timestamp.split('T')[0]} lúc
                                                        {message.timestamp.split('T')[1]}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div ref={endOfMessagesRef} />
                            </div>

                            {/* Input Area */}

                            <div className="w-full px-6 py-4 border-t border-gray-200">
                                {files.length > 0 && (
                                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                        {files.map((file, index) => (
                                            <div key={index} className="relative">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    {file.type === 'image' ? (
                                                        <img
                                                            src={file.preview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full relative flex items-center justify-center bg-gray-800">
                                                            <BsPlayFill className="text-white text-3xl" />
                                                            <video src={file.preview} className="hidden" />
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-0 -right-2 bg-gray-800 rounded-full p-1"
                                                >
                                                    <AiOutlineClose className="text-white text-sm" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-end gap-2 items-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FiPlusCircle className="text-2xl text-blue-500" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                    />
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Aa"
                                            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 max-h-32"
                                            rows={1}
                                            style={{ minHeight: '40px' }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim() && files.length === 0}
                                        className={`p-2 rounded-full ${
                                            message.trim() || files.length > 0
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : 'bg-gray-200'
                                        } transition-colors`}
                                    >
                                        {isLoadingAdd ? (
                                            <div className="text-white">
                                                <Loading></Loading>
                                            </div>
                                        ) : (
                                            <FiSend
                                                className={`text-xl ${
                                                    message.trim() || files.length > 0 ? 'text-white' : 'text-gray-400'
                                                }`}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
