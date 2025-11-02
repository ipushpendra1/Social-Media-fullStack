import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toggleLike, createComment } from '../utils/api.js'

export default function PostCard({ 
  postId, 
  username, 
  avatarUrl, 
  postImage, 
  likesCount: initialLikesCount, 
  caption, 
  comments: initialComments = [],
  onUpdate,
  onRefresh 
}) {
  const navigate = useNavigate()
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [comments, setComments] = useState(initialComments || [])
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)

  // Update local state when props change (e.g., after refresh)
  useEffect(() => {
    setLikesCount(initialLikesCount || 0)
    setComments(initialComments || [])
  }, [initialLikesCount, initialComments])

  const preview = Array.isArray(comments) ? comments.slice(0, 2) : []

  const handleLike = async () => {
    if (!postId || isLiking) return

    try {
      setIsLiking(true)
      await toggleLike(postId)
      
      // Refetch posts to get accurate like count (since backend toggles)
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Failed to like post. Please try again.')
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!postId || !commentText.trim() || isCommenting) return

    try {
      setIsCommenting(true)
      const commentInput = commentText.trim()
      const originalText = commentText
      setCommentText('')
      setShowCommentInput(false)

      await createComment(postId, commentInput)
      
      // Refetch posts to get the actual comment with proper user data
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      // Restore comment text and show input again on error
      setCommentText(originalText)
      setShowCommentInput(true)
      alert('Failed to post comment. Please try again.')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <article className="post card">
      <header className="post-header">
        <img 
          className="avatar" 
          src={avatarUrl} 
          alt={`${username} avatar`}
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="user">
          <strong 
            className="username" 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </strong>
        </div>
      </header>

      <div className="post-media">
        <img className="post-image" src={postImage} alt="Post media" />
      </div>

      <div className="post-actions" aria-label="Post actions">
        <button 
          className="icon-btn" 
          aria-label="Like"
          onClick={handleLike}
          disabled={isLiking}
          style={{ cursor: isLiking ? 'wait' : 'pointer' }}
        >
          ❤️
        </button>
        <button 
          className="icon-btn" 
          aria-label="Comment"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          💬
        </button>
        <button className="icon-btn" aria-label="Share">📤</button>
      </div>

      <div className="post-body">
        <div className="likes">{Number(likesCount).toLocaleString()} likes</div>
        <div className="caption">
          <strong 
            className="username" 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </strong>
          <span> {caption}</span>
        </div>
        <div className="post-comments">
          {preview.map((c, idx) => (
            <div key={c._id || idx} className="comment">
              <strong className="username">{c.user}</strong>
              <span> {c.text}</span>
            </div>
          ))}
        </div>
        {showCommentInput && (
          <form onSubmit={handleCommentSubmit} style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                borderRadius: '4px', 
                border: '1px solid var(--border, #ccc)',
                background: 'var(--bg, white)',
                color: 'var(--text, black)'
              }}
              disabled={isCommenting}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isCommenting}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: 'var(--button-bg, #007bff)',
                color: 'var(--button-text, white)',
                cursor: isCommenting ? 'wait' : 'pointer'
              }}
            >
              {isCommenting ? 'Posting...' : 'Post'}
            </button>
          </form>
        )}
      </div>
    </article>
  )
}
