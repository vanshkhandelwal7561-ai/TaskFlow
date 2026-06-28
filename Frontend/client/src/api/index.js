import api from './axios';

// ── Auth ──────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Boards ────────────────────────────────────────────
export const getBoards = () => api.get('/boards');
export const getBoard = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards', data);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

// ── Tasks ─────────────────────────────────────────────
export const getTasksByBoard = (boardId, params) =>
  api.get(`/boards/${boardId}/tasks`, { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ── AI ────────────────────────────────────────────────
export const getAiSuggestion = (data) => api.post('/ai/suggest', data);
