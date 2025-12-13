const API_BASE_URL = 'http://localhost:3000'

/**
 * Makes an API request with authentication cookies
 * @param {string} endpoint - API endpoint (e.g., '/posts')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
    headers: {
      ...options.headers,
    },
  }

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      const errorMessage = error.message || `HTTP error! status: ${response.status}`
      
      // For 401 errors, create a special error that can be handled
      if (response.status === 401) {
        const authError = new Error(errorMessage)
        authError.status = 401
        throw authError
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    // Handle network errors (connection refused, reset, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const networkError = new Error('Unable to connect to server. Please make sure the backend server is running on port 3000.')
      networkError.isNetworkError = true
      networkError.originalError = error
      throw networkError
    }
    // Re-throw other errors (including 401)
    throw error
  }
}

/**
 * Creates a new post
 * @param {File} imageFile - The image file to upload
 * @param {string[]} mentions - Optional array of user IDs to mention
 * @returns {Promise<object>}
 */
export async function createPost(imageFile, mentions = []) {
  const formData = new FormData()
  formData.append('image', imageFile)
  
  // Send mentions as JSON string - backend will need to parse if it's a string
  // or handle as array if multer processes it correctly
  if (mentions && mentions.length > 0) {
    // Multer with FormData typically sends arrays when you use the same field name
    // But to be safe, send as JSON string that backend can parse
    formData.append('mentions', JSON.stringify(mentions))
  }

  return apiRequest('/posts', {
    method: 'POST',
    body: formData,
  })
}

/**
 * Fetches posts from the backend
 * @param {number} skip - Number of posts to skip (for pagination)
 * @param {number} limit - Maximum number of posts to fetch (1-20)
 * @returns {Promise<object>} Object containing posts array
 */
export async function getPosts(skip = 0, limit = 10) {
  return apiRequest(`/posts?skip=${skip}&limit=${limit}`)
}

/**
 * Likes or unlikes a post
 * @param {string} postId - The ID of the post to like/unlike
 * @returns {Promise<object>}
 */
export async function toggleLike(postId) {
  return apiRequest('/posts/like', {
    method: 'POST',
    body: JSON.stringify({ post: postId }),
  })
}

/**
 * Creates a comment on a post
 * @param {string} postId - The ID of the post to comment on
 * @param {string} text - The comment text
 * @returns {Promise<object>}
 */
export async function createComment(postId, text) {
  return apiRequest('/posts/comment', {
    method: 'POST',
    body: JSON.stringify({ post: postId, text }),
  })
}

/**
 * Fetches the current user's profile
 * @returns {Promise<object>} User profile object
 */
export async function getProfile() {
  return apiRequest('/profile')
}

/**
 * Updates the current user's profile
 * @param {object} profileData - Profile data to update {username?, bio?, imageFile?}
 * @returns {Promise<object>} Updated user profile
 */
export async function updateProfile(profileData) {
  const { username, bio, imageFile } = profileData
  
  const formData = new FormData()
  
  if (username !== undefined) {
    formData.append('username', username)
  }
  
  if (bio !== undefined) {
    formData.append('bio', bio)
  }
  
  if (imageFile) {
    formData.append('image', imageFile)
  }

  return apiRequest('/profile', {
    method: 'PUT',
    body: formData,
  })
}

/**
 * Logs out the current user
 * @returns {Promise<object>}
 */
export async function logout() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  })
}

