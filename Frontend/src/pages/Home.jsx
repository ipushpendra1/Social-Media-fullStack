import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard.jsx'
import { getPosts } from '../utils/api.js'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getPosts(0, 10)
      // Transform backend data to match PostCard props
      const transformedPosts = response.posts.map(post => ({
        id: post._id,
        username: post.user?.username || 'Unknown',
        avatarUrl: post.user?.image || 'https://i0.wp.com/fdlc.org/wp-content/uploads/2021/01/157-1578186_user-profile-default-image-png-clipart.png.jpeg?fit=880%2C769&ssl=1',
        postImage: post.image,
        likesCount: post.likesCount || 0,
        caption: post.caption || '',
        comments: post.comments || []
      }))
      setPosts(transformedPosts)
    } catch (err) {
      console.error('Error fetching posts:', err)
      // Provide user-friendly error messages
      let errorMessage = 'Failed to load posts'
      
      if (err.isNetworkError) {
        errorMessage = 'Unable to connect to server. Please make sure the backend server is running on port 3000.'
      } else if (err.status === 401) {
        errorMessage = 'You are not logged in. Please log in and try again.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdate = (postId, updates) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    )
  }

  const refreshPosts = async () => {
    try {
      const response = await getPosts(0, 10)
      const transformedPosts = response.posts.map(post => ({
        id: post._id,
        username: post.user?.username || 'Unknown',
        avatarUrl: post.user?.image || 'https://i0.wp.com/fdlc.org/wp-content/uploads/2021/01/157-1578186_user-profile-default-image-png-clipart.png.jpeg?fit=880%2C769&ssl=1',
        postImage: post.image,
        likesCount: post.likesCount || 0,
        caption: post.caption || '',
        comments: post.comments || []
      }))
      setPosts(transformedPosts)
    } catch (err) {
      console.error('Error refreshing posts:', err)
      // Silently handle refresh errors - user can retry if needed
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="feed" aria-label="Home feed">
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading posts...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="feed" aria-label="Home feed">
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error, red)' }}>
            Error: {error}
            <button 
              onClick={fetchPosts} 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="container">
        <div className="feed" aria-label="Home feed">
          <div style={{ padding: '2rem', textAlign: 'center' }}>No posts yet. Be the first to post!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="feed" aria-label="Home feed">
        {posts.map(post => (
          <PostCard
            key={post.id}
            postId={post.id}
            username={post.username}
            avatarUrl={post.avatarUrl}
            postImage={post.postImage}
            likesCount={post.likesCount}
            caption={post.caption}
            comments={post.comments}
            onUpdate={(updates) => handlePostUpdate(post.id, updates)}
            onRefresh={refreshPosts}
          />
        ))}
      </div>
    </div>
  )
}
