import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    timeout: 10000, // tempo limite de 10 segundos
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de requisição (opcional)
apiClient.interceptors.request.use(
    (config) => {
        // Adicione tokens de autenticação, se necessário
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta (opcional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Lide com erros globais, como redirecionamento ao login
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
