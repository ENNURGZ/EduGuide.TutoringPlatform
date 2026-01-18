import React, { useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

const ConversationDetails = ({
    activeConversation,
    messages,
    currentUserId,
    newMessage,
    setNewMessage,
    handleSendMessage,
    onBack
}) => {
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const otherParticipant = activeConversation ? (
        activeConversation.studentId == currentUserId ? activeConversation.tutor?.name : activeConversation.student?.name
    ) : 'Müşteri';

    return (
        <div className="flex flex-col h-full bg-white sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                            {otherParticipant.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{otherParticipant}</h3>
                        <p className="text-xs text-green-600 font-medium">Çevrimiçi</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>Henüz mesaj yok. İlk mesajı siz gönderin!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId == currentUserId;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.body}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-indigo-200' : 'text-gray-400'
                                        }`}>
                                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isMe && <CheckCheck className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConversationDetails;
