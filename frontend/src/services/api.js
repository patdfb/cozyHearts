  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const parseApiResponse = async (response) => {
    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    return { data, text };
  };

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

      const { data, text } = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || 'Falha no login');
      }

      if (!data) {
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
          throw new Error('A API devolveu HTML em vez de JSON. Verifique a VITE_API_URL no deploy.');
        }
        throw new Error('Resposta inesperada da API no login.');
      }

      localStorage.setItem('supabase_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.membro || data.usuario || null));
      return data;
    },

    async register(userData) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const { data } = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro no registo');
      }
      return data;
    },

  async updatePerfil(formData) {
    const token = localStorage.getItem('supabase_token');

    const response = await fetch(`${API_BASE_URL}/membros/me`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
        // NOTA: O browser define o Content-Type automaticamente para FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro na API');
    }

    return await response.json();
  }
};