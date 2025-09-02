// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Interfaz del modelo Cliente basada en tu base de datos real (campos en mayúsculas como los envía el backend)
export interface Cliente {
  ID: number;
  DNICIF?: string;
  NOMBRE?: string;
  DIRECCION?: string;
  POBLACION?: string;
  PROVINCIA?: string;
  CODPOSTAL?: string;
  PAIS?: string;
  TELEF1?: string;
  TELEF2?: string;
  EMAIL1?: string;
  EMAIL2?: string;
  OBSERVACIONES?: string;
  NOMBRECOMERCIAL?: string;
  SEGMENTO?: string;
  NUMBONO?: string;
  FECHAPRESENTADA?: string;
  FECHACONCESION?: string;
  CNAE?: string;
  IAE?: string;
  PLANTILLAMEDIA?: string;
  ANTIGUEDAD?: string;
  COMERCIAL?: string;
  TEST?: boolean;
  RV?: boolean;
  MINIMIS?: string;
  REPLEGAL?: string;
  REPLEGALCARGO?: string;
  REPLEGALDNI?: string;
  REPLEGALTELEF?: string;
  NOTARIO?: string;
  PROTOCOLO?: string;
  FECHAPROTOCOLO?: string;
  PRESENTADA?: boolean;
  CONCESION?: boolean;
  IDUSUARIO?: number;
  TEXTLEAD?: string;
  NUMROPO?: string;
  CADUROPO?: string;
  DESCATALOGADO?: boolean;
}

// DTOs para las requests
export interface CreateClienteRequest {
  nombre: string;
  dniCif?: string;
  direccion?: string;
  poblacion?: string;
  provincia?: string;
  codPostal?: string;
  pais?: string;
  telef1?: string;
  telef2?: string;
  email1?: string;
  email2?: string;
  observaciones?: string;
  nombreComercial?: string;
  comercial?: string;
  descatalogado?: boolean;
}

export interface UpdateClienteRequest {
  nombre?: string;
  dniCif?: string;
  direccion?: string;
  poblacion?: string;
  provincia?: string;
  codPostal?: string;
  pais?: string;
  telef1?: string;
  telef2?: string;
  email1?: string;
  email2?: string;
  observaciones?: string;
  nombreComercial?: string;
  comercial?: string;
  descatalogado?: boolean;
}

// Interfaces para Localizadores
// Interfaces para Acuerdos
export interface Acuerdo {
  ID: number;
  NOMBRE?: string;
  SEGMENTO?: string;
  COMERCIAL?: string;
  CIF_NIF?: string;
  IMPORTE?: string;
  NBONO?: string;
  VALIDADOS?: string;
  LANZADOS?: string;
  IVAPAGADO?: string;
  PRIMER_JUST_PRESENTADO?: string;
  SEGUND_JUST_PRESENTADO?: string;
  OBSERVACIONES?: string;
  FECHAFACTURA?: string;
  PRESENTADOS?: string;
  ENVIADO?: boolean;
  COBRADO?: boolean;
  FECHA_ENVIADO?: string;
  FECHA_COBRADO?: string;
  BAJA?: boolean;
}
export interface Localizador {
  ID?: number;
  Id?: number;
  CLIENTE?: number;
  ClienteId?: number;
  COMERCIAL?: string;
  Comercial?: string;
  MODELO?: string;
  Modelo?: string;
  GPS?: number;
  Gps?: number;
  IBBUTON?: string;
  IbButton?: string;
  BLUETOOTH?: number;
  Bluetooth?: number;
  DESCUENTOS_APLICADOS?: number;
  DescuentosAplicados?: number;
  CUOTA_MENSUAL_TOTAL?: number;
  CuotaMensualTotal?: number;
  CUOTA_ANUAL_TOTAL?: number;
  CuotaAnualTotal?: number;
  ANO_VENTA?: number;
  AnoVenta?: number;
  OBSERVACIONES?: string;
  Observaciones?: string;
  TIPO?: string;
  Tipo?: string;
  Cliente?: {
    ID?: number;
    NOMBRE?: string;
    EMAIL1?: string;
    DNICIF?: string;
    DESCATALOGADO?: boolean;
  };
}

export interface CreateLocalizadorRequest {
  clienteId?: number;
  comercial?: string;
  modelo?: string;
  gps?: number;
  ibButton?: string;
  bluetooth?: number;
  descuentosAplicados?: number;
  cuotaMensualTotal?: number;
  cuotaAnualTotal?: number;
  anoVenta?: number;
  observaciones?: string;
  tipo?: string;
}

export interface UpdateLocalizadorRequest {
  clienteId?: number;
  comercial?: string;
  modelo?: string;
  gps?: number;
  ibButton?: string;
  bluetooth?: number;
  descuentosAplicados?: number;
  cuotaMensualTotal?: number;
  cuotaAnualTotal?: number;
  anoVenta?: number;
  observaciones?: string;
  tipo?: string;
}

// Cliente API para comunicación con el backend real
class ApiClient {
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Métodos para Acuerdos
  async getAcuerdosActivos(): Promise<Acuerdo[]> {
    return this.request<Acuerdo[]>("/Acuerdos/activos");
  }
  async getAcuerdosTodos(): Promise<Acuerdo[]> {
    return this.request<Acuerdo[]>("/Acuerdos/total");
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Si la respuesta está vacía (ej. DELETE), no intentar parsear JSON
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Métodos para clientes reales
  async getClientes(): Promise<Cliente[]> {
    const response = await this.request<Cliente[]>('/ClientesSimple');
    return response;
  }

  async getClienteById(id: number): Promise<Cliente> {
    return this.request<Cliente>(`/ClientesSimple/${id}`);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/ClientesSimple/test-connection');
  }

  // CRUD para clientes
  async createCliente(clienteData: CreateClienteRequest): Promise<Cliente> {
    // Limpiar los datos para evitar problemas de serialización
    const cleanData = {
      nombre: clienteData.nombre?.trim() || '',
      dniCif: clienteData.dniCif?.trim() || null,
      direccion: clienteData.direccion?.trim() || null,
      poblacion: clienteData.poblacion?.trim() || null,
      provincia: clienteData.provincia?.trim() || null,
      codPostal: clienteData.codPostal?.trim() || null,
      pais: clienteData.pais?.trim() || null,
      telef1: clienteData.telef1?.trim() || null,
      telef2: clienteData.telef2?.trim() || null,
      email1: clienteData.email1?.trim() || null,
      email2: clienteData.email2?.trim() || null,
      nombreComercial: clienteData.nombreComercial?.trim() || null,
      comercial: clienteData.comercial?.trim() || null,
      observaciones: clienteData.observaciones?.trim() || null,
      descatalogado: Boolean(clienteData.descatalogado)
    };
    
    return this.request<Cliente>('/ClientesSimple', {
      method: 'POST',
      body: JSON.stringify(cleanData),
    });
  }

  async updateCliente(id: number, clienteData: UpdateClienteRequest): Promise<Cliente> {
    // Limpiar los datos para evitar problemas de serialización
    const cleanData = {
      nombre: clienteData.nombre?.trim() || null,
      dniCif: clienteData.dniCif?.trim() || null,
      direccion: clienteData.direccion?.trim() || null,
      poblacion: clienteData.poblacion?.trim() || null,
      provincia: clienteData.provincia?.trim() || null,
      codPostal: clienteData.codPostal?.trim() || null,
      pais: clienteData.pais?.trim() || null,
      telef1: clienteData.telef1?.trim() || null,
      telef2: clienteData.telef2?.trim() || null,
      email1: clienteData.email1?.trim() || null,
      email2: clienteData.email2?.trim() || null,
      nombreComercial: clienteData.nombreComercial?.trim() || null,
      comercial: clienteData.comercial?.trim() || null,
      observaciones: clienteData.observaciones?.trim() || null,
      descatalogado: clienteData.descatalogado
    };
    
    return this.request<Cliente>(`/ClientesSimple/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleanData),
    });
  }

  async deleteCliente(id: number): Promise<void> {
    return this.request<void>(`/ClientesSimple/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Localizadores
  async getLocalizadores(): Promise<Localizador[]> {
    return this.request<Localizador[]>('/Localizadores');
  }

  async getLocalizadorById(id: number): Promise<Localizador> {
    return this.request<Localizador>(`/Localizadores/${id}`);
  }

  async getLocalizadoresByTipo(tipo: string): Promise<Localizador[]> {
    return this.request<Localizador[]>(`/Localizadores/ByTipo/${tipo}`);
  }

  async getLocalizadoresByCliente(clienteId: number): Promise<Localizador[]> {
    return this.request<Localizador[]>(`/Localizadores/ByCliente/${clienteId}`);
  }

  async createLocalizador(localizadorData: CreateLocalizadorRequest): Promise<Localizador> {
    const cleanData = {
      clienteId: localizadorData.clienteId || null,
      comercial: localizadorData.comercial?.trim() || null,
      modelo: localizadorData.modelo?.trim() || null,
      gps: localizadorData.gps || null,
      ibButton: localizadorData.ibButton?.trim() || null,
      bluetooth: localizadorData.bluetooth || null,
      descuentosAplicados: localizadorData.descuentosAplicados || null,
      cuotaMensualTotal: localizadorData.cuotaMensualTotal || null,
      cuotaAnualTotal: localizadorData.cuotaAnualTotal || null,
      anoVenta: localizadorData.anoVenta || null,
      observaciones: localizadorData.observaciones?.trim() || null,
      tipo: localizadorData.tipo?.trim() || null
    };

    return this.request<Localizador>('/Localizadores', {
      method: 'POST',
      body: JSON.stringify(cleanData),
    });
  }

  async updateLocalizador(id: number, localizadorData: UpdateLocalizadorRequest): Promise<Localizador> {
    const cleanData = {
      clienteId: localizadorData.clienteId || null,
      comercial: localizadorData.comercial?.trim() || null,
      modelo: localizadorData.modelo?.trim() || null,
      gps: localizadorData.gps || null,
      ibButton: localizadorData.ibButton?.trim() || null,
      bluetooth: localizadorData.bluetooth || null,
      descuentosAplicados: localizadorData.descuentosAplicados || null,
      cuotaMensualTotal: localizadorData.cuotaMensualTotal || null,
      cuotaAnualTotal: localizadorData.cuotaAnualTotal || null,
      anoVenta: localizadorData.anoVenta || null,
      observaciones: localizadorData.observaciones?.trim() || null,
      tipo: localizadorData.tipo?.trim() || null
    };

    return this.request<Localizador>(`/Localizadores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleanData),
    });
  }

  async deleteLocalizador(id: number): Promise<void> {
    return this.request<void>(`/Localizadores/${id}`, {
      method: 'DELETE',
    });
  }

  async testLocalizadoresConnection(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/Localizadores/test-connection');
  }

  // Métodos para otros endpoints cuando los necesites
  async getContratos(): Promise<any[]> {
    return this.request<any[]>('/contratos');
  }

  async getDashboardKPIs(): Promise<any> {
    return this.request<any>('/dashboard/kpis');
  }
}

// Instancia única del cliente API
export const apiClient = new ApiClient();
export const acuerdosApi = {
  getActivos: () => apiClient.getAcuerdosActivos(),
  getTotal: () => apiClient.getAcuerdosTodos(),
  create: (acuerdoData: Partial<Acuerdo>) => apiClient.post('/Acuerdos', acuerdoData),
  update: (id: number, acuerdoData: Partial<Acuerdo>) => apiClient.put(`/Acuerdos/${id}`, acuerdoData),
  delete: (id: number) => apiClient.delete(`/Acuerdos/${id}`)
};

// Funciones de conveniencia para usar en los componentes
export const clientesApi = {
  getAll: () => apiClient.getClientes(),
  getById: (id: number) => apiClient.getClienteById(id),
  create: (clienteData: CreateClienteRequest) => apiClient.createCliente(clienteData),
  update: (id: number, clienteData: UpdateClienteRequest) => apiClient.updateCliente(id, clienteData),
  delete: (id: number) => apiClient.deleteCliente(id),
  testConnection: () => apiClient.testConnection(),
};

export const localizadoresApi = {
  getAll: () => apiClient.getLocalizadores(),
  getById: (id: number) => apiClient.getLocalizadorById(id),
  getByTipo: (tipo: string) => apiClient.getLocalizadoresByTipo(tipo),
  getByCliente: (clienteId: number) => apiClient.getLocalizadoresByCliente(clienteId),
  create: (localizadorData: CreateLocalizadorRequest) => apiClient.createLocalizador(localizadorData),
  update: (id: number, localizadorData: UpdateLocalizadorRequest) => apiClient.updateLocalizador(id, localizadorData),
  delete: (id: number) => apiClient.deleteLocalizador(id),
  testConnection: () => apiClient.testLocalizadoresConnection(),
};

// Eliminar duplicidad: acuerdosApi ya está exportado arriba con los métodos CRUD

export const contratosApi = {
  getAll: () => apiClient.getContratos(),
};

export const dashboardApi = {
  getKPIs: () => apiClient.getDashboardKPIs(),
};

export default apiClient;
