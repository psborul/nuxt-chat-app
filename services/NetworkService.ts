class NetworkService {
  url;
  constructor() {
    this.url = "/api";
  }

  async get(url: string) {
    const response = await fetch(url, {
      method: "GET",
    });

    return await response.json();
  }

  async post(url: string, payload: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok) {
      // use server error message if present
      const message = json.statusMessage || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return json;
  }
}

export default new NetworkService();
