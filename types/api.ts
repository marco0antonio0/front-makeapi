export interface EndpointField {
  title: string
  tipo: "string" | "number" | "image"
  mult: boolean // true = multiple lines, false = single line
}

export interface Endpoint {
  id: string
  title: string
  campos: EndpointField[]
  createdAt: string
  updatedAt: string
}

export interface EndpointItem {
  id: string
  endpointId: string
  data: Record<string, any> // Dynamic data based on endpoint fields
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
