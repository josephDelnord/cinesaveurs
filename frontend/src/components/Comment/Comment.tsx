import "./Comment.scss";

const Comment = () => {
  return (
    <div className="comment-container">
      <div className="comment-input-section">
        <label htmlFor="comment-input" className="comment-label">
          Commentaire
        </label>
        <textarea
          id="comment-input"
          className="comment-textarea"
          placeholder="Écris ici ton commentaire.."
          maxLength="250"
        />
        <span className="comment-char-counter">22/250</span>
        <button className="comment-submit-btn">Envoie</button>
      </div>

      <div className="comment-list-section">
        <div className="comment-pagination">
          <button className="comment-page-btn">Première</button>
          <span className="comment-current-page">3/100</span>
          <button className="comment-page-btn">Prochaine</button>
          <button className="comment-page-btn">Dernière</button>
        </div>

        <div className="comment-item">
          <div className="comment-avatar"></div>
          <div className="comment-content">
            <h4 className="comment-username">Pseudo</h4>
            <p className="comment-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <span className="comment-date">02/05/22</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
