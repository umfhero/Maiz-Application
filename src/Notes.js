import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the Notes page
const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const NoteItem = styled.div`
  padding: 10px;
  background-color: #444;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoteTitle = styled.input`
  color: #fff;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1.2em;
  flex-grow: 1;
  padding: 5px;
  cursor: text;
  &:focus {
    outline: none;
  }
`;

const NoteContent = styled.div`
  color: #fff;
  background: none;
  border: none;
  flex-grow: 1;
  width: 100%;
  min-height: 100px;
  resize: none;
  padding: 5px;
  margin-top: 10px;
  &:focus {
    outline: none;
  }
  white-space: pre-wrap;
`;

const PinButton = styled.button`
  background: none;
  border: none;
  color: #ffdd00;
  cursor: pointer;
  font-size: 1.2em;
  margin-left: 10px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #ffdd00;
  cursor: pointer;
  font-size: 1.2em;
  margin-left: 10px;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  margin-top: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const ModeDisplay = styled.div`
  color: #fff;
  margin-top: 10px;
  font-size: 1.2em;
`;

const PinnedNotesSection = styled.div`
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
`;

const LivePreview = styled.div`
  color: #fff;
  background-color: #333;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
`;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [showLiveView, setShowLiveView] = useState(false);

  const addNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: `Note ${notes.length + 1}`,
      content: '',
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
  };

  const updateNote = (id, field, value) => {
    const updatedNotes = notes.map(n => n.id === id ? { ...n, [field]: value } : n);
    setNotes(updatedNotes);
  };

  const pinNote = (note) => {
    if (!pinnedNotes.find(n => n.id === note.id)) {
      const updatedPinnedNotes = [...pinnedNotes, note];
      const updatedNotes = notes.filter(n => n.id !== note.id);
      setPinnedNotes(updatedPinnedNotes);
      setNotes(updatedNotes);
    }
  };

  const toggleLiveView = () => {
    setShowLiveView(!showLiveView);
  };

  const handleInput = (event, note) => {
    const content = event.target.innerText;
    const formattedContent = applyCustomMarkdown(content);
    updateNote(note.id, 'content', formattedContent);

    // Move the cursor to the end after the update
    setTimeout(() => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(event.target);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0);
  };

  const applyCustomMarkdown = (text) => {
    const lines = text.split('\n');
    let result = '';
    let inList = false;

    lines.forEach((line) => {
      // Handling bullet points
      if (/^(\*|\-)\s+/.test(line)) {
        if (!inList) {
          inList = true;
          result += '<ul>';
        }
        const content = line.replace(/^(\*|\-)\s+/, '');
        result += `<li>${content}</li>`;
      } else {
        if (inList) {
          inList = false;
          result += '</ul>';
        }
        
        // Handling math calculations
        if (/=\s*$/.test(line)) {
          let expression = line.replace(/\s*=\s*$/, '').trim();
          expression = expression.replace(/x/g, '*'); // Replace 'x' with '*'
          try {
            const resultValue = eval(expression);
            line = `${expression.replace(/\*/g, 'x')} = ${resultValue}`;
          } catch (error) {
            console.error('Invalid expression:', expression);
          }
        }

        // Check for headings
        if (/^### (.*)/.test(line)) {
          const content = line.replace(/^### /, '');
          result += `<h3>${content}</h3>`;
        } else if (/^## (.*)/.test(line)) {
          const content = line.replace(/^## /, '');
          result += `<h2>${content}</h2>`;
        } else if (/^# (.*)/.test(line)) {
          const content = line.replace(/^# /, '');
          result += `<h1>${content}</h1>`;
        } else if (/^---/.test(line)) {
          result += '<hr>';
        } else {
          if (line.trim() !== '') {
            result += `<p>${line}</p>`;
          }
        }
      }
    });

    if (inList) {
      result += '</ul>';
    }

    return result;
  };

  const saveNote = (note) => {
    updateNote(note.id, 'content', note.content);
  };

  return (
    <NotesContainer>
      <Button onClick={addNote}>Quick Note</Button>
      <ToggleButton onClick={toggleLiveView}>
        Toggle {showLiveView ? 'Separate' : 'Combined'} View
      </ToggleButton>
      <ModeDisplay>
        Current Mode: {showLiveView ? 'Combined View' : 'Separate View'}
      </ModeDisplay>

      <PinnedNotesSection>
        <h3>Pinned Notes</h3>
        {pinnedNotes.length === 0 ? (
          <p>No pinned notes</p>
        ) : (
          pinnedNotes.map((note) => (
            <NoteItem key={note.id}>
              <NoteHeader>
                <NoteTitle 
                  value={note.title} 
                  onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                />
                <div>
                  <PinButton onClick={() => pinNote(note)}>📌</PinButton>
                  {!showLiveView && <EditButton>✏️</EditButton>}
                </div>
              </NoteHeader>
              {showLiveView ? (
                <NoteContent
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => handleInput(e, note)}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              ) : (
                <>
                  <NoteContent
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, note)}
                  />
                  <LivePreview dangerouslySetInnerHTML={{ __html: note.content }} />
                </>
              )}
              <SaveButton onClick={() => saveNote(note)}>Save</SaveButton>
            </NoteItem>
          ))
        )}
      </PinnedNotesSection>

      {notes.map((note) => (
        <NoteItem key={note.id}>
          <NoteHeader>
            <NoteTitle 
              value={note.title} 
              onChange={(e) => updateNote(note.id, 'title', e.target.value)}
            />
            <div>
              {!showLiveView && <EditButton>✏️</EditButton>}
              <PinButton onClick={() => pinNote(note)}>📌</PinButton>
            </div>
          </NoteHeader>
          {showLiveView ? (
            <NoteContent
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, note)}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ) : (
            <>
              <NoteContent
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => handleInput(e, note)}
              />
              <LivePreview dangerouslySetInnerHTML={{ __html: note.content }} />
            </>
          )}
          <SaveButton onClick={() => saveNote(note)}>Save</SaveButton>
        </NoteItem>
      ))}
    </NotesContainer>
  );
};

export default Notes;
