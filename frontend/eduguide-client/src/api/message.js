import api from './client';

export const getConversations = async () => {
    const response = await api.get('/Conversation');
    return response.data;
};

export const getMessages = async (conversationId) => {
    const response = await api.get(`/Conversation/${conversationId}/messages`);
    return response.data;
};

export const sendMessage = async (conversationId, content) => {
    // Controller expects [FromBody] string body. 
    // We send it as a JSON string, e.g. "Hello World"
    const response = await api.post(`/Conversation/${conversationId}/messages`, JSON.stringify(content), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
