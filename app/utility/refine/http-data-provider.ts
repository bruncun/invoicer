import type { DataProvider } from "@refinedev/core";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

export const httpDataProvider: DataProvider = {
  getList: (params) => {
    const query = new URLSearchParams({
      current: String(params.pagination?.current ?? 1),
      pageSize: String(params.pagination?.pageSize ?? 10),
      filters: JSON.stringify(params.filters ?? []),
      sorters: JSON.stringify(params.sorters ?? []),
    });
    return request(`/api/data/${params.resource}?${query}`);
  },
  getOne: (params) => request(`/api/data/${params.resource}/${params.id}`),
  update: (params) =>
    request(`/api/data/${params.resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.variables),
    }),
  create: (params) =>
    request(`/api/data/${params.resource}`, {
      method: "POST",
      body: JSON.stringify(params.variables),
    }),
  deleteOne: (params) =>
    request(`/api/data/${params.resource}/${params.id}`, { method: "DELETE" }),
  getApiUrl: () => "/api/data",
};
