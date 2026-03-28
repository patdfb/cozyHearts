  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  export const eventService = {
    async getEventos() {
      const token = localStorage.getItem('supabase_token');
      const response = await fetch(`${API_BASE_URL}/atividades`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erro ao buscar eventos');
      return await response.json();
    },

    async criarEvento(formData) {
      const token = localStorage.getItem('supabase_token') ||
        JSON.parse(localStorage.getItem('supabase_session'))?.access_token;

      const response = await fetch(`${API_BASE_URL}/atividades`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${errorText}`);
      }
      return await response.json();
    },

    async editarEvento(id, formData) {
      const token = localStorage.getItem('supabase_token') ||
        JSON.parse(localStorage.getItem('supabase_session'))?.access_token;

      const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${errorText}`);
      }
      return await response.json();
    },

    async deletarEvento(id) {
      const token = localStorage.getItem('supabase_token') ||
        JSON.parse(localStorage.getItem('supabase_session'))?.access_token;

      const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${errorText}`);
      }
      return await response.json();
    }
  };

  export const authService = {
    async login(email, password) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha no login');
      }

      const data = await response.json();
      localStorage.setItem('supabase_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.membro));
      return data;
    },

    async register(userData) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no registo');
      }
      return await response.json();
    },

  async updatePerfil(formData) {
    const token = localStorage.getItem('supabase_token') ||
      JSON.parse(localStorage.getItem('supabase_session'))?.access_token;

    const response = await fetch(`${API_BASE_URL}/auth/update-perfil`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
        // IMPORTANTE: Ao usar FormData, não definimos Content-Type manualmente
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Erro ao atualizar perfil';
      try {
        const errorJson = JSON.parse(errorText);
        message = errorJson.error || message;
      } catch (e) {
        message = errorText || message;
      }
      throw new Error(message);
    }

    return await response.json();
  }
};