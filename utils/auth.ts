// ~/services/fetchWithAuth.ts
import Storage from '~/services/Storage';

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const user = Storage.get(STORAGE_USER_KEY);
  const token = user?.token;

  const headers = {
    ...init.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(input, {
    ...init,
    headers,
  });
}