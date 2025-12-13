import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../utils/api.js'

export default function CreatePost() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mentions, setMentions] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleMentionsChange(e) {
    setMentions(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!selectedImage) {
      setError('Please select an image to upload')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Parse mentions (comma-separated user IDs or usernames)
      // For now, we'll send it as is - backend expects array of user IDs
      // If mentions are provided as comma-separated values, convert to array
      let mentionsArray = []
      if (mentions.trim()) {
        mentionsArray = mentions.split(',').map(m => m.trim()).filter(m => m)
      }

      const response = await createPost(selectedImage, mentionsArray)
      
      setSuccess(true)
      
      // Reset form
      setSelectedImage(null)
      setPreview(null)
      setMentions('')
      
      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = 'Failed to create post. Please try again.'
      
      if (err.isNetworkError) {
        errorMessage = 'Unable to connect to server. Please make sure the backend server is running on port 3000.'
      } else if (err.status === 401) {
        errorMessage = 'You are not logged in. Please log in and try again.'
      } else if (err.message) {
        // Show the specific error message from the backend
        errorMessage = err.message
        // Add helpful hints for common errors
        if (err.message.includes('ImageKit')) {
          errorMessage += ' Please check your ImageKit configuration in the backend.'
        } else if (err.message.includes('Gemini') || err.message.includes('GEMINI')) {
          errorMessage += ' Please check your Gemini API key configuration in the backend.'
        }
      }
      
      setError(errorMessage)
      console.error('Error creating post:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleRemoveImage() {
    setSelectedImage(null)
    setPreview(null)
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="card form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-header">
            <h1 style={{ margin: 0 }}>Create New Post</h1>
            <p className="muted">Share your moment with the community</p>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            {/* Image Upload */}
            <div className="field">
              <label htmlFor="image">Image</label>
              {!preview ? (
                <div
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input"
                    style={{ display: 'none' }}
                    required
                  />
                  <label
                    htmlFor="image"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>📷</span>
                    <span>Click to upload an image</span>
                    <span className="muted" style={{ fontSize: '0.875rem' }}>
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '18px',
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Mentions (Optional) */}
            <div className="field">
              <label htmlFor="mentions">Mentions (Optional)</label>
              <input
                id="mentions"
                name="mentions"
                type="text"
                placeholder="Enter user IDs separated by commas (e.g., user1, user2)"
                className="input"
                value={mentions}
                onChange={handleMentionsChange}
              />
              <small className="muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                Mention other users by their IDs
              </small>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--error-bg, rgba(239, 68, 68, 0.1))',
                  color: 'var(--error-text, #dc2626)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--success-bg, rgba(34, 197, 94, 0.1))',
                  color: 'var(--success-text, #16a34a)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                Post created successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-block"
              disabled={loading || !selectedImage}
              style={{
                opacity: loading || !selectedImage ? 0.6 : 1,
                cursor: loading || !selectedImage ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating Post...' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
