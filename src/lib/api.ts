// Configuración de la API del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.intercanjes.com/api';

export interface ContactFormData {
  tipo: 'canjea' | 'forma';
  nombre: string;
  mail: string;
  telefono: string;
  mensaje: string;
  empresa?: string;
  ubicacion?: string;
  fotos?: File[]; // Array de archivos de fotos
}

export interface ContactResponse {
  success: boolean;
  message: string;
  fotosEnviadas?: number;
}

export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('tipo', data.tipo);
    formData.append('nombre', data.nombre);
    formData.append('mail', data.mail);
    formData.append('telefono', data.telefono);
    formData.append('mensaje', data.mensaje);
    
    // Campos opcionales solo para "canjea"
    if (data.tipo === 'canjea') {
      if (data.empresa) {
        formData.append('empresa', data.empresa);
      }
      if (data.ubicacion) {
        formData.append('ubicacion', data.ubicacion);
      }
    }
    
    // Agregar fotos (solo para "canjea" y si hay fotos)
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((foto) => {
        formData.append('fotos', foto);
      });
    }

    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      // NO incluir Content-Type header - el navegador lo establecerá automáticamente con el boundary para multipart/form-data
      body: formData,
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



