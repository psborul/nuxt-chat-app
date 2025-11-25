import Storage from "~/services/Storage";
import { STORAGE_USER_KEY } from "~/utils/constants";

class NetworkService {
  private baseURL = "";

  async get<T>(url: string): Promise<T> {
    const user = Storage.get(STORAGE_USER_KEY);
    const response = await fetch(this.baseURL + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }

    return json;
  }

  async post<T>(url: string, payload?: any): Promise<T> {
    const user = Storage.get(STORAGE_USER_KEY);

    const response = await fetch(this.baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }

    return json;
  }
}

export default new NetworkService();
