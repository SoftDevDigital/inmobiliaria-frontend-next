// Configuración de la API del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ContactFormData {
  tipo: 'canjea' | 'forma';
  nombre: string;
  mail: string;
  telefono: string;
  mensaje: string;
  empresa?: string;
  ubicacion?: string;
  foto?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.message || 'Error al enviar el formulario');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

