import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Send, Search, MessageSquare, Check, CheckCheck, User, ArrowLeft } from 'lucide-react';
import { getConversations, getMessages, sendMessage } from '../../api/message';
import Layout from '../../components/Layout';
import ConversationDetails from './ConversationDetails';

const Messages = () => {
    const [searchParams] = useSearchParams();
    const requestIdParam = searchParams.get('requestId');
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const currentUserId = parseInt(localStorage.getItem('userId'));
    const role = localStorage.getItem('role');
    const messagesEndRef = useRef(null);

    const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
            const data = await getConversations();
            setConversations(data);

            if (requestIdParam && data.length > 0) {
                const target = data.find(c => c.requestId === parseInt(requestIdParam));
                if (target) setSelectedConversation(target);
            }
        } catch (error) {
            console.error("Conversations fetch error", error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (convId) => {
        setLoadingMessages(true);
        try {
            const data = await getMessages(convId);
            setMessages(data);
        } catch (error) {
            console.error("Messages fetch error", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [requestIdParam]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const data = await sendMessage(selectedConversation.id, newMessage);

            setMessages(prev => [...prev, data]);
            setNewMessage('');
        } catch (error) {
            console.error("Send message error", error);
            alert("Mesaj gönderilemedi.");
        } finally {
            setSending(false);
        }
    };

    const getPartnerName = (conv) => {
        if (role === 'Tutor') return conv.student?.name || 'Öğrenci';
        return conv.tutor?.name || 'Eğitmen';
    };

    const isMyMessage = (msg) => msg.senderId === currentUserId;

    return (
        <Layout>
            <div className="h-[calc(100vh-140px)] min-h-[600px] flex bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600" /> Mesajlar
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Sohbet ara..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loadingConversations ? (
                            <div className="p-8 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                            </div>
                        ) : conversations.length > 0 ? (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 truncate pr-2">{getPartnerName(conv)}</h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                        </span>
                                    </div>
                                    <p className="text-xs text-indigo-600 font-medium truncate mb-0.5">
                                        {conv.request?.listing?.title}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        Sohbet başlatıldı.
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p>Henüz aktif bir sohbetiniz yok.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConversation ? (
                        <ConversationDetails
                            activeConversation={selectedConversation}
                            messages={messages}
                            currentUserId={currentUserId}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                            onBack={() => {
                                setSelectedConversation(null);
                                setSearchParams({});
                            }}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 text-gray-400 p-8 text-center">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Konuşma Seçin</h3>
                            <p className="max-w-xs mx-auto">Mesajlaşmaya başlamak için sol menüden bir konuşma seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Messages;
