import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../utils/api.js'

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    image: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      setLoading(true)
      setError('')
      const response = await getProfile()
      const userData = response.user
      setProfile({
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || '',
        image: userData.image || 'https://i0.wp.com/fdlc.org/wp-content/uploads/2021/01/157-1578186_user-profile-default-image-png-clipart.png.jpeg?fit=880%2C769&ssl=1'
      })
      setFormData({
        username: userData.username || '',
        bio: userData.bio || ''
      })
      setPreview(null)
      setSelectedImage(null)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit() {
    setEditMode(true)
    setFormData({
      username: profile.username,
      bio: profile.bio
    })
    setError('')
    setSuccess(false)
    setPreview(null)
    setSelectedImage(null)
  }

  function handleCancel() {
    setEditMode(false)
    setFormData({
      username: profile.username,
      bio: profile.bio
    })
    setError('')
    setSuccess(false)
    setPreview(null)
    setSelectedImage(null)
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setSelectedImage(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setSelectedImage(null)
    setPreview(null)
  }

  async function handleSave() {
    // Validate username
    if (!formData.username.trim()) {
      setError('Username cannot be empty')
      return
    }

    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const updateData = {
        username: formData.username.trim(),
        bio: formData.bio.trim()
      }

      if (selectedImage) {
        updateData.imageFile = selectedImage
      }

      const response = await updateProfile(updateData)
      
      // Update profile state with new data
      setProfile({
        username: response.user.username,
        email: response.user.email,
        bio: response.user.bio || '',
        image: response.user.image
      })

      setSuccess(true)
      setEditMode(false)
      setPreview(null)
      setSelectedImage(null)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="screen">
        <div className="container">
          <div className="center" style={{ padding: '2rem' }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="card form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-header">
            <h1 style={{ margin: 0 }}>Profile</h1>
            <p className="muted">View and edit your profile information</p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--error-bg, rgba(239, 68, 68, 0.1))',
                color: 'var(--error-text, #dc2626)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--success-bg, rgba(34, 197, 94, 0.1))',
                color: 'var(--success-text, #16a34a)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
              role="alert"
            >
              Profile updated successfully!
            </div>
          )}

          <div className="form">
            {/* Profile Image */}
            <div className="field" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Profile Picture</label>
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <img
                  src={preview || profile.image}
                  alt="Profile"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--border, #e5e7eb)',
                  }}
                />
                {editMode && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="profile-image"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--primary, #3b82f6)',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        marginRight: '0.5rem',
                      }}
                    >
                      {preview ? 'Change Image' : 'Upload New Image'}
                    </label>
                    {preview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--error, #dc2626)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={profile.email}
                disabled
                style={{
                  backgroundColor: 'var(--bg-secondary,rgb(0, 0, 0))',
                  cursor: 'not-allowed',
                }}
              />
              <small className="muted" style={{ fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                Email cannot be changed
              </small>
            </div>

            {/* Username */}
            <div className="field">
              <label htmlFor="username">Username</label>
              {editMode ? (
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="input"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  minLength={1}
                />
              ) : (
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="input"
                  value={profile.username}
                  disabled
                  style={{
                    backgroundColor: 'var(--bg-secondary,rgb(0, 0, 0))',
                    cursor: 'not-allowed',
                  }}
                />
              )}
            </div>

            {/* Bio */}
            <div className="field">
              <label htmlFor="bio">Bio</label>
              {editMode ? (
                <textarea
                  id="bio"
                  name="bio"
                  className="input"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  style={{
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <textarea
                  id="bio"
                  name="bio"
                  className="input"
                  value={profile.bio || 'No bio yet'}
                  disabled
                  rows={4}
                  style={{
                    backgroundColor: 'var(--bg-secondary,rgb(0, 0, 0))',
                    cursor: 'not-allowed',
                    resize: 'none',
                  }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {!editMode ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn-block"
                  style={{
                    backgroundColor: 'var(--primary, #3b82f6)',
                    color: 'white',
                  }}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-block"
                    disabled={saving}
                    style={{
                      backgroundColor: 'var(--bg-secondary, #f3f4f6)',
                      color: 'var(--text, #111827)',
                      flex: 1,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-block"
                    disabled={saving}
                    style={{
                      backgroundColor: 'var(--primary, #3b82f6)',
                      color: 'white',
                      flex: 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
