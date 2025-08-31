import type { Endpoint, EndpointItem } from "@/types/api"

// Mock database using arrays
export const mockEndpoints: Endpoint[] = [
  {
    id: "1",
    title: "Produtos",
    campos: [
      { title: "nome", tipo: "string", mult: false },
      { title: "descricao", tipo: "string", mult: true },
      { title: "preco", tipo: "number", mult: false },
      { title: "imagem", tipo: "image", mult: false },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Usuarios",
    campos: [
      { title: "nome", tipo: "string", mult: false },
      { title: "email", tipo: "string", mult: false },
      { title: "bio", tipo: "string", mult: true },
    ],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

export const mockEndpointItems: EndpointItem[] = [
  {
    id: "1",
    endpointId: "1",
    data: {
      nome: "iPhone 15",
      descricao: "Smartphone Apple com tecnologia avançada e design premium",
      preco: 4999,
      imagem: "/iphone-15-hands.png",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    endpointId: "1",
    data: {
      nome: "MacBook Pro",
      descricao: "Notebook profissional para desenvolvedores e criadores de conteúdo",
      preco: 12999,
      imagem: "/silver-macbook-pro-desk.png",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    endpointId: "2",
    data: {
      nome: "João Silva",
      email: "joao@example.com",
      bio: "Desenvolvedor Full Stack com 5 anos de experiência em React e Node.js",
    },
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

// Helper functions to simulate database operations
export const db = {
  endpoints: {
    findAll: () => [...mockEndpoints],
    findById: (id: string) => mockEndpoints.find((e) => e.id === id),
    create: (endpoint: Omit<Endpoint, "id" | "createdAt" | "updatedAt">) => {
      const newEndpoint: Endpoint = {
        ...endpoint,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockEndpoints.push(newEndpoint)
      return newEndpoint
    },
    update: (id: string, updates: Partial<Endpoint>) => {
      const index = mockEndpoints.findIndex((e) => e.id === id)
      if (index === -1) return null

      mockEndpoints[index] = {
        ...mockEndpoints[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return mockEndpoints[index]
    },
    delete: (id: string) => {
      const index = mockEndpoints.findIndex((e) => e.id === id)
      if (index === -1) return false

      mockEndpoints.splice(index, 1)
      // Also delete all items for this endpoint
      const itemsToDelete = mockEndpointItems.filter((item) => item.endpointId === id)
      itemsToDelete.forEach((item) => {
        const itemIndex = mockEndpointItems.findIndex((i) => i.id === item.id)
        if (itemIndex !== -1) mockEndpointItems.splice(itemIndex, 1)
      })
      return true
    },
  },

  items: {
    findByEndpointId: (endpointId: string) => mockEndpointItems.filter((item) => item.endpointId === endpointId),
    findById: (id: string) => mockEndpointItems.find((item) => item.id === id),
    create: (item: Omit<EndpointItem, "id" | "createdAt" | "updatedAt">) => {
      const newItem: EndpointItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockEndpointItems.push(newItem)
      return newItem
    },
    update: (id: string, updates: Partial<EndpointItem>) => {
      const index = mockEndpointItems.findIndex((item) => item.id === id)
      if (index === -1) return null

      mockEndpointItems[index] = {
        ...mockEndpointItems[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return mockEndpointItems[index]
    },
    delete: (id: string) => {
      const index = mockEndpointItems.findIndex((item) => item.id === id)
      if (index === -1) return false

      mockEndpointItems.splice(index, 1)
      return true
    },
  },
}
