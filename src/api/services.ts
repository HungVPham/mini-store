import api from './api';


export const listProducts = async (offset: number, limit: number) => {
    const response = await api.get(`/products?offset=${offset}&limit=${limit}`);
    return response.data;
};

export const searchProducts = async (query: string) => {
    const response = await api.get(`/products?title=${query}`);
    return response.data;
};

export const getProductDetail = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const addToCart = async (userId: string, products: { id: string, quantity: number }[]) => {
    const response = await api.post(`/cart/add`, { userId, products });
    return response.data;
};

export const updateCart = async (cartId: number) => {
    const response = await api.put(`/cart/${cartId}`, { cartId });
    return response.data;
};

export const removeFromCart = async (cartId: number) => {
    const response = await api.delete(`/cart/${cartId}`);
    return response.data;
};















