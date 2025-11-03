import Storage from "~/services/Storage";

class NetworkService {
  url;
  constructor() {
    this.url = "";
  }

  async get<T>(url: string): Promise<T> {
    const user = Storage.get(STORAGE_USER_KEY);
    const response = await fetch(this.url + url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return await response.json();
  }

  async post<T>(url: string, payload: any): Promise<T> {
    const user = Storage.get(STORAGE_USER_KEY);

    const response = await fetch(this.url + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // REPLACE ADDING TOKEN SOMEWHERE
        Authorization: user ? `Bearer ${user.token}`: "",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok) {
      // use server error message if present
      const message =
        json.statusMessage || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return json;
  }
}

export default new NetworkService();
