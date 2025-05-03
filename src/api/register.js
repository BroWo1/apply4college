import api from '@/api'

/**
 * Registers a new frontend user via the API.
 * @param {Object} userData
 * @param {string} userData.username
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.biography
 * @param {File}   [userData.profile_picture]
 * @returns {Promise<Object>} Created user data
 */
export async function registerUser({ username, email, password, biography, profile_picture }) {
  // If there's a file, use FormData
  if (profile_picture) {
    const form = new FormData()
    form.append('username', username)
    form.append('email', email)
    form.append('password', password)
    form.append('biography', biography)
    form.append('profile_picture', profile_picture)

    const response = await api.post('register/', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  // Otherwise send JSON
  const response = await api.post('register/', {
    username,
    email,
    password,
    biography
  })
  return response.data
}
