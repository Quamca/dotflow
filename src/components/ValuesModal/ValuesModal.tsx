import { useState } from 'react'

interface ThemeItem {
  text: string
  removed: boolean
}

interface ValuesModalProps {
  proposedThemes: string[]
  onConfirm: (values: string[]) => void
  onDismiss: () => void
}

export default function ValuesModal({ proposedThemes, onConfirm, onDismiss }: ValuesModalProps) {
  const [items, setItems] = useState<ThemeItem[]>(
    () => proposedThemes.map((text) => ({ text, removed: false }))
  )
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newThemeInput, setNewThemeInput] = useState('')
  const [useNone, setUseNone] = useState(false)
  const [customText, setCustomText] = useState('')

  function handleToggleRemove(index: number) {
    setItems(items.map((item, i) => i === index ? { ...item, removed: !item.removed } : item))
  }

  function handleStartEdit(index: number) {
    setEditingIndex(index)
    setEditValue(items[index].text)
  }

  function handleSaveEdit() {
    if (editingIndex === null) return
    const trimmed = editValue.trim()
    if (trimmed) {
      setItems(items.map((item, i) => i === editingIndex ? { ...item, text: trimmed } : item))
    }
    setEditingIndex(null)
    setEditValue('')
  }

  function handleAddTheme() {
    const trimmed = newThemeInput.trim()
    if (!trimmed) return
    setItems([...items, { text: trimmed, removed: false }])
    setNewThemeInput('')
  }

  function handleConfirm() {
    if (useNone) {
      const custom = customText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      onConfirm(custom)
    } else {
      onConfirm(items.filter((item) => !item.removed).map((item) => item.text))
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p style={headingStyle}>
          W Twoich wpisach te tematy wracają najczęściej:
        </p>

        {!useNone && (
          <>
            <ul style={listStyle}>
              {items.map((item, i) => (
                <li key={i} style={itemStyle}>
                  {editingIndex === i ? (
                    <span style={{ display: 'flex', gap: '6px', flex: 1 }}>
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        style={inputStyle}
                        autoFocus
                      />
                      <button onClick={handleSaveEdit} style={smallBtnStyle}>✓</button>
                    </span>
                  ) : (
                    <>
                      <span style={{ flex: 1, textDecoration: item.removed ? 'line-through' : 'none', color: item.removed ? '#A8A29E' : '#44403C' }}>
                        {item.text}
                      </span>
                      {!item.removed && (
                        <button onClick={() => handleStartEdit(i)} style={smallBtnStyle}>edit</button>
                      )}
                      <button
                        onClick={() => handleToggleRemove(i)}
                        style={{ ...smallBtnStyle, color: item.removed ? '#1C1917' : '#A8A29E' }}
                        title={item.removed ? 'Przywróć' : 'Usuń'}
                      >
                        {item.removed ? '↺' : '×'}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div style={addRowStyle}>
              <input
                value={newThemeInput}
                onChange={(e) => setNewThemeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
                placeholder="Dodaj własny temat..."
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={handleAddTheme} style={addBtnStyle}>Dodaj</button>
            </div>
          </>
        )}

        <p style={instructionStyle}>
          Co z tej listy brzmi jak Twoje? Możesz zmienić, usunąć, dodać.
        </p>

        <label style={noneStyle}>
          <input
            type="checkbox"
            checked={useNone}
            onChange={(e) => setUseNone(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Żadna z tych
        </label>

        {useNone && (
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Wpisz swoje tematy oddzielone przecinkami..."
            style={textareaStyle}
          />
        )}

        <div style={actionsStyle}>
          <button onClick={onDismiss} style={secondaryBtnStyle}>
            Pomiń
          </button>
          <button onClick={handleConfirm} style={primaryBtnStyle}>
            Zatwierdź
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
}

const modalStyle: React.CSSProperties = {
  background: '#FAFAF9',
  borderRadius: '12px',
  padding: '28px 24px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  maxHeight: '90vh',
  overflowY: 'auto',
}

const headingStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#1C1917',
  marginBottom: '16px',
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 8px 0',
}

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 0',
  borderBottom: '1px solid #E7E5E4',
  fontSize: '14px',
}

const addRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  marginBottom: '12px',
  marginTop: '4px',
}

const instructionStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#78716C',
  marginBottom: '12px',
}

const noneStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  color: '#78716C',
  cursor: 'pointer',
  marginBottom: '12px',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '72px',
  borderRadius: '8px',
  border: '1px solid #D6D3D1',
  padding: '8px 12px',
  fontSize: '13px',
  color: '#1C1917',
  resize: 'vertical',
  marginBottom: '12px',
  boxSizing: 'border-box',
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '8px',
}

const primaryBtnStyle: React.CSSProperties = {
  background: '#1C1917',
  color: '#FAFAF9',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 18px',
  fontSize: '14px',
  cursor: 'pointer',
}

const secondaryBtnStyle: React.CSSProperties = {
  background: 'transparent',
  color: '#78716C',
  border: '1px solid #D6D3D1',
  borderRadius: '8px',
  padding: '8px 18px',
  fontSize: '14px',
  cursor: 'pointer',
}

const smallBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#78716C',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '2px 6px',
}

const addBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #D6D3D1',
  borderRadius: '6px',
  color: '#44403C',
  cursor: 'pointer',
  fontSize: '13px',
  padding: '4px 12px',
  whiteSpace: 'nowrap',
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #D6D3D1',
  borderRadius: '6px',
  padding: '3px 8px',
  fontSize: '14px',
}
