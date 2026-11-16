import { useState, useEffect } from 'react';
import './index.css';

const STORAGE_KEY = 'bw-notes';

const readStoredNotes = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function App() {
  const [notes, setNotes] = useState(readStoredNotes);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      }
    } catch {
      // Ignore localStorage quota or browser-blocked errors.
    }
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId ? { ...note, title: trimmedTitle, content: trimmedContent } : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: trimmedTitle,
        content: trimmedContent,
        date: new Date().toLocaleDateString('en-IN'),
      };
      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }

    setTitle('');
    setContent('');
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Notes</h1>
        <p>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your note here..."
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId !== null ? 'Update Note' : 'Add Note'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="notes-grid">
        {notes.length === 0 ? (
          <p className="empty-message">No notes yet. Add one above.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-date">{note.date}</span>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-actions">
                <button onClick={() => handleEdit(note)} className="btn-outline">
                  Edit
                </button>
                <button onClick={() => handleDelete(note.id)} className="btn-outline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;