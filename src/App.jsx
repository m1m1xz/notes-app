import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // Load saved notes from localStorage on initial render
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bw-notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Save notes to localStorage whenever the notes array changes
  useEffect(() => {
    localStorage.setItem('bw-notes', JSON.stringify(notes));
  }, [notes]);

  // Handle Add or Update Note
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingId ? { ...note, title, content } : note
        )
      );
      setEditingId(null);
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString('en-IN'),
      };
      setNotes([newNote, ...notes]);
    }

    // Clear input fields
    setTitle('');
    setContent('');
  };

  // Populate form for editing
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  // Delete a note
  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingId === id) handleCancelEdit();
  };

  return (
    <div className="container">
      <header>
        <h1>Notes</h1>
        <p>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
      </header>

      {/* Form to Add or Update Notes */}
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
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
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

      {/* Display Notes List */}
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
                <button
                  onClick={() => handleEdit(note)}
                  className="btn-outline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="btn-outline"
                >
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