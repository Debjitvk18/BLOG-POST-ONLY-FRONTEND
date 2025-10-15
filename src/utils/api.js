const BASE_URL = import.meta.env.VITE_API_URL + "/api";


/* ----------------------------- TOKEN HELPERS ----------------------------- */
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getAuthHeaders = () => {
  const token = getAccessToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  ...getAuthHeaders(),
});

/* ----------------------------- REFRESH TOKEN ----------------------------- */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) throw new Error("Failed to refresh token");

  const data = await response.json();
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } else {
    throw new Error("No access token in refresh response");
  }
};

/* --------------------------- FETCH WITH AUTO REFRESH --------------------------- */
const fetchWithAuth = async (url, options = {}, retry = true) => {
  const response = await fetch(url, {
    ...options,
    headers: { ...options.headers, ...getAuthHeaders() },
  });

  // If token expired, try refreshing once
  if (response.status === 401 && retry) {
    try {
      const newAccessToken = await refreshAccessToken();
      const retryResponse = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newAccessToken}` },
      });
      return retryResponse;
    } catch (err) {
      clearTokens();
      throw new Error("Session expired, please log in again");
    }
  }

  return response;
};

/* ----------------------------- API FUNCTIONS ----------------------------- */
export const api = {
  /* REGISTER */
  async register(username, email, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  /* LOGIN */
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Login failed");

    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken);
    } else if (data.token) {
      // backward compatibility
      localStorage.setItem("accessToken", data.token);
    }

    return data;
  },

  /* LOGOUT */
  async logout() {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ token: getRefreshToken() }),
    });

    if (!response.ok) throw new Error("Logout failed");
    clearTokens();
  },

  /* GET ALL POSTS */
  async getPosts() {
    const response = await fetchWithAuth(`${BASE_URL}/posts`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to fetch posts");
    return data;
  },

  /* PAGINATED POSTS */
  async getPaginatedPosts(page = 1) {
    const response = await fetchWithAuth(`${BASE_URL}/posts/paginated?page=${page}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to fetch paginated posts");
    return data;
  },

  /* USER'S OWN POSTS */
  async getMyPosts(page = 1) {
    const response = await fetchWithAuth(`${BASE_URL}/posts/my-posts?page=${page}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to fetch user's posts");
    return data;
  },

  /* OTHER USERS' POSTS */
  async getOtherPosts(page = 1) {
    const response = await fetchWithAuth(`${BASE_URL}/posts/other-posts?page=${page}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to fetch other users' posts");
    return data;
  },

  /* GET SINGLE POST */
  async getPost(id) {
    const response = await fetchWithAuth(`${BASE_URL}/posts/${id}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to fetch post");
    return data;
  },

  /* CREATE POST */
  async createPost(title, content, image) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const response = await fetchWithAuth(`${BASE_URL}/posts`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to create post");
    return data;
  },

  /* UPDATE POST */
  async updatePost(id, title, content, image) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const response = await fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to update post");
    return data;
  },

  /* DELETE POST */
  async deletePost(id) {
    const response = await fetchWithAuth(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to delete post");
    return true;
  },
};
