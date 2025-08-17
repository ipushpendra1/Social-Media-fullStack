export default function PostCard({ username, avatarUrl, postImage, likesCount, caption, comments = [] }) {
    const preview = Array.isArray(comments) ? comments.slice(0, 2) : []
  
    return (
      <article className="post card">
        <header className="post-header">
          <img className="avatar" src={avatarUrl} alt={`${username} avatar`} />
          <div className="user">
            <strong className="username">{username}</strong>
          </div>
        </header>
  
        <div className="post-media">
          <img className="post-image" src={postImage} alt="Post media" />
        </div>
  
        <div className="post-actions" aria-label="Post actions">
          <button className="icon-btn" aria-label="Like">❤️</button>
          <button className="icon-btn" aria-label="Comment">💬</button>
          <button className="icon-btn" aria-label="Share">📤</button>
        </div>
  
        <div className="post-body">
          <div className="likes">{Number(likesCount).toLocaleString()} likes</div>
          <div className="caption">
            <strong className="username">{username}</strong>
            <span> {caption}</span>
          </div>
          <div className="post-comments">
            {preview.map((c, idx) => (
              <div key={idx} className="comment">
                <strong className="username">{c.user}</strong>
                <span> {c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </article>
    )
  }