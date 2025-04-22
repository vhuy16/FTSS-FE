import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsMic, BsSend } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import PageBreadcrumb from '@common/PageBreadCrumb';
import { useAppDispatch, useAppSelector } from '@redux/hook';
import { getAllRoom, getRoomDetail, selectRoom } from '@redux/slices/chatSlice';
import LoadingPage from '@components/atom/Loading/LoadingPage';
import Avatar from '@components/atom/header/Avatar';
import { subscribeToRoomMessages } from 'realtime/supabaseListeners';

const Chat = () => {
    const dispatch = useAppDispatch();
    const rooms = useAppSelector((state) => state.chat.rooms);
    const selectedRoom = useAppSelector((state) => state.chat.selectedRoom);
    const chat = useAppSelector((state) => state.chat.chat);
    const isLoading = useAppSelector((state) => state.chat.isLoading);
    useEffect(() => {
        dispatch(getAllRoom());
    }, []);
    useEffect(() => {
        if (selectedRoom.id) {
            dispatch(getRoomDetail(selectedRoom.id));
            const channel = subscribeToRoomMessages(selectedRoom.id, dispatch);
            return () => {
                channel && channel.unsubscribe(); // hoặc `supabase.removeChannel(channel);`
            };
        }
    }, [selectedRoom.id]);
    return (
        <>
            <PageBreadcrumb pageTitle="Tin nhắn" />
            {isLoading ? (
                <LoadingPage></LoadingPage>
            ) : (
                <div className="space-y-6" style={{ height: '80vh' }}>
                    <div className="flex h-full bg-[#F9FAFB] p-6 font-sans">
                        {/* Sidebar */}
                        <div className="hidden md:flex flex-col w-80 bg-white rounded-xl shadow-sm mr-6">
                            <div className="p-6 border-b border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search chats"
                                    className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-y-3 p-3">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/[0.03]"
                                            // className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${
                                            //     room.active ? 'bg-gray-100' : 'hover:bg-gray-100'
                                            // }`}
                                            onClick={() => dispatch(selectRoom(room))}
                                        >
                                            <div className="relative">
                                                <div className="relative h-12 w-full max-w-[48px] rounded-full">
                                                    <Avatar name={room?.customerId as string}></Avatar>
                                                </div>
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                        {room.customerId}
                                                    </h3>
                                                    {/* <span className="text-xs text-gray-400">{chat.timestamp}</span> */}
                                                </div>
                                                <p className="text-xs text-gray-500">Khách hàng</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <div className="relative h-12 w-full max-w-[48px] rounded-full">
                                            <Avatar name={chat && chat.length > 0 ? chat[0].username : ''} />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {chat && chat.length > 0 ? chat[0].username : ''}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <IoCallOutline className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] ml-4 cursor-pointer" />
                                    <IoVideocamOutline className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] ml-4 cursor-pointer" />
                                    <BsThreeDotsVertical className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] ml-4 cursor-pointer" />
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <div className="space-y-4">
                                    {chat.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.role === 'Manager' ? 'justify-end pr-1' : 'items-start'
                                            }`}
                                        >
                                            {message.role === 'Customer' && (
                                                <div className="relative h-12 w-full max-w-[48px] rounded-full">
                                                    <Avatar name={message.username ?? ''}></Avatar>
                                                </div>
                                            )}
                                            <div
                                                className={`w-full flex flex-col ${
                                                    message.role === 'Manager' ? 'items-end' : 'items-start'
                                                }`}
                                            >
                                                {/* {message.image && (
                                                    <img
                                                        src={message.image}
                                                        alt="Shared content"
                                                        className="max-w-[70%] rounded-xl mb-1"
                                                    />
                                                )} */}
                                                <div
                                                    className={`px-4 py-2 rounded-xl max-w-[70%] ${
                                                        message.role === 'Manager'
                                                            ? 'bg-[#4F46E5] text-white'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    <p className="text-sm leading-5">{message.text}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <BsEmojiSmile className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] cursor-pointer" />
                                        <BsPaperclip className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] cursor-pointer" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Type a message"
                                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                                    />
                                    <div className="flex items-center gap-3">
                                        <BsMic className="w-5 h-5 text-gray-500 hover:text-[#4F46E5] cursor-pointer" />
                                        <button className="p-2 bg-[#4F46E5] rounded-full">
                                            <BsSend className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
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
