import Storage from "~/services/Storage";

class NetworkService {
  url;
  constructor() {
    this.url = "/api";
  }

  async get(url: string) {
    const user = Storage.get(STORAGE_USER_KEY);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return await response.json();
  }

  async post(url: string, payload: any) {
    const user = Storage.get(STORAGE_USER_KEY);

    const response = await fetch(url, {
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
