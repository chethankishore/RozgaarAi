// src/components/ats/SuggestionsPanel.jsx
import { useState } from 'react'
import SuggestionCard from './SuggestionCard'
import toast from 'react-hot-toast'
import api from '../../lib/axios'

export default function SuggestionsPanel({ suggestions = [], resumeId }) {
  const [applied, setApplied] = useState([])       // visual "applied" indicator
  const [applying, setApplying] = useState({})
  const [removedIds, setRemovedIds] = useState([]) // user‑removed suggestion ids

  const visibleSuggestions = suggestions.filter(s => !removedIds.includes(s.id))

  function handleRemove(suggestion) {
    setRemovedIds(prev => [...prev, suggestion.id])
    toast.success(`Suggestion removed – it will not be applied`, { icon: '🗑️' })
  }

  function handleRestoreAll() {
    setRemovedIds([])
    toast.success('All removed suggestions restored', { icon: '↺' })
  }

  async function handleApply(suggestion) {
    if (!resumeId) {
      toast.error('Resume ID missing – please re‑analyze the resume')
      return
    }
    const suggestionText = suggestion.after
    setApplying(prev => ({ ...prev, [suggestion.id]: true }))
    try {
      const response = await api.post(
        '/resume/apply-suggestions',
        { resumeId, suggestions: [suggestionText] },
        { responseType: 'blob' }
      )
      const blob = new Blob([response.data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'corrected_resume.txt'
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Suggestion applied – text file downloaded`)
      setApplied(prev => [...prev, suggestion.id])
    } catch (err) {
      let errorMsg = 'Failed to apply suggestion'
      if (err.response?.data) {
        const text = await err.response.data.text()
        try { errorMsg = JSON.parse(text).message || errorMsg } catch { errorMsg = text || errorMsg }
      } else { errorMsg = err.message }
      toast.error(errorMsg)
    } finally {
      setApplying(prev => ({ ...prev, [suggestion.id]: false }))
    }
  }

  async function handleApplyAll() {
    if (!resumeId) {
      toast.error('Resume ID missing – please re‑analyze the resume')
      return
    }
    const keptSuggestions = suggestions.filter(s => !removedIds.includes(s.id))
    if (keptSuggestions.length === 0) {
      toast.error('No suggestions left to apply – restore removed ones first')
      return
    }
    const allSuggestionTexts = keptSuggestions.map(s => s.after)
    setApplying({ all: true })
    try {
      const response = await api.post(
        '/resume/apply-suggestions',
        { resumeId, suggestions: allSuggestionTexts },
        { responseType: 'blob' }
      )
      const blob = new Blob([response.data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'corrected_resume_all_suggestions.txt'
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`All kept suggestions applied – text file downloaded`)
      setApplied(keptSuggestions.map(s => s.id))
    } catch (err) {
      let errorMsg = 'Failed to apply all suggestions'
      if (err.response?.data) {
        const text = await err.response.data.text()
        try { errorMsg = JSON.parse(text).message || errorMsg } catch { errorMsg = text || errorMsg }
      } else { errorMsg = err.message }
      toast.error(errorMsg)
    } finally {
      setApplying({ all: false })
    }
  }

  const removedCount = removedIds.length
  const keptCount = suggestions.length - removedCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>
          AI suggestions
          <span style={{ marginLeft: 'var(--space-2)', padding: '1px 8px', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>
            {keptCount} / {suggestions.length}
          </span>
          {removedCount > 0 && (
            <button onClick={handleRestoreAll} style={{ marginLeft: 'var(--space-3)', fontSize: 'var(--text-xs)', padding: '2px 8px', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}>
              ↺ Restore {removedCount} removed
            </button>
          )}
        </p>
      </div>

      {visibleSuggestions.map(s => (
        <div key={s.id} style={{ opacity: applied.includes(s.id) ? 0.45 : 1, transition: 'opacity var(--transition-base)' }}>
          <SuggestionCard suggestion={s} onApply={handleApply} onRemove={handleRemove} applying={applying[s.id]} />
        </div>
      ))}

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleApplyAll} disabled={keptCount === 0 || applying.all}>
        {applying.all
          ? 'Applying suggestions...'
          : keptCount === suggestions.length
          ? `Apply all & download (${keptCount} suggestions)`
          : `Apply kept suggestions & download (${keptCount} of ${suggestions.length})`}
      </button>
    </div>
  )
}
// // // // // frontend/src/components/ats/SuggestionsPanel.jsx
// // // // import { useState } from 'react'
// // // // import SuggestionCard from './SuggestionCard'
// // // // import toast from 'react-hot-toast'
// // // // import { applySuggestion } from '../../services/resumeService'

// // // // const FILTERS = ['All', 'Improve', 'Add', 'Remove']

// // // // export default function SuggestionsPanel({ suggestions = [], resumeId }) {
// // // //   const [filter,   setFilter]   = useState('All')
// // // //   const [applied,  setApplied]  = useState([])
// // // //   const [applying, setApplying] = useState({}) // tracks individual apply actions

// // // //   const visible = filter === 'All'
// // // //     ? suggestions
// // // //     : suggestions.filter(s => s.type === filter)

// // // //   // Apply a single suggestion using backend AI
// // // //   async function handleApply(suggestion) {
// // // //     if (!resumeId) {
// // // //       toast.error('Resume ID missing – please re‑analyze the resume');
// // // //       return;
// // // //     }
// // // //     const suggestionText = suggestion.after; // or suggestion.before? Use the suggested change text
// // // //     setApplying(prev => ({ ...prev, [suggestion.id]: true }));
// // // //     try {
// // // //       const result = await applySuggestion({ resumeId, suggestions: [suggestionText] });
// // // //       // Download corrected resume as .txt file
// // // //       const blob = new Blob([result.correctedResumeText], { type: 'text/plain' });
// // // //       const url = URL.createObjectURL(blob);
// // // //       const a = document.createElement('a');
// // // //       a.href = url;
// // // //       a.download = 'corrected_resume.txt';
// // // //       a.click();
// // // //       URL.revokeObjectURL(url);
// // // //       toast.success(`Suggestion applied – resume downloaded`);
// // // //       setApplied(prev => [...prev, suggestion.id]);
// // // //     } catch (err) {
// // // //       toast.error(err.message || 'Failed to apply suggestion');
// // // //     } finally {
// // // //       setApplying(prev => ({ ...prev, [suggestion.id]: false }));
// // // //     }
// // // //   }

// // // //   // Apply all suggestions at once
// // // //   async function handleApplyAll() {
// // // //     if (!resumeId) {
// // // //       toast.error('Resume ID missing – please re‑analyze the resume');
// // // //       return;
// // // //     }
// // // //     const allSuggestionTexts = suggestions.map(s => s.after);
// // // //     setApplying({ all: true });
// // // //     try {
// // // //       const result = await applySuggestion({ resumeId, suggestions: allSuggestionTexts });
// // // //       const blob = new Blob([result.correctedResumeText], { type: 'text/plain' });
// // // //       const url = URL.createObjectURL(blob);
// // // //       const a = document.createElement('a');
// // // //       a.href = url;
// // // //       a.download = 'corrected_resume_all_suggestions.txt';
// // // //       a.click();
// // // //       URL.revokeObjectURL(url);
// // // //       toast.success(`All suggestions applied – resume downloaded`);
// // // //       setApplied(suggestions.map(s => s.id));
// // // //     } catch (err) {
// // // //       toast.error(err.message || 'Failed to apply all suggestions');
// // // //     } finally {
// // // //       setApplying({ all: false });
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

// // // //       {/* Header row */}
// // // //       <div style={{
// // // //         display: 'flex', alignItems: 'center',
// // // //         justifyContent: 'space-between', flexWrap: 'wrap',
// // // //         gap: 'var(--space-3)',
// // // //       }}>
// // // //         <p style={{
// // // //           fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
// // // //           color: 'var(--color-text-primary)'
// // // //         }}>
// // // //           AI suggestions
// // // //           <span style={{
// // // //             marginLeft: 'var(--space-2)',
// // // //             padding: '1px 8px',
// // // //             background: 'var(--color-primary-subtle)',
// // // //             color: 'var(--color-primary)',
// // // //             borderRadius: 'var(--radius-full)',
// // // //             fontSize: 'var(--text-xs)',
// // // //           }}>
// // // //             {suggestions.length}
// // // //           </span>
// // // //         </p>

// // // //         {/* Filter pills */}
// // // //         <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
// // // //           {FILTERS.map(f => (
// // // //             <button key={f}
// // // //               onClick={() => setFilter(f)}
// // // //               style={{
// // // //                 padding: '4px 12px',
// // // //                 fontSize: 'var(--text-xs)',
// // // //                 fontWeight: 'var(--weight-medium)',
// // // //                 borderRadius: 'var(--radius-full)',
// // // //                 border: 'none', cursor: 'pointer',
// // // //                 background: filter === f
// // // //                   ? 'var(--color-primary)'
// // // //                   : 'var(--color-primary-subtle)',
// // // //                 color: filter === f
// // // //                   ? '#fff'
// // // //                   : 'var(--color-primary)',
// // // //                 transition: 'background var(--transition-fast)',
// // // //               }}
// // // //             >
// // // //               {f}
// // // //             </button>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Cards */}
// // // //       {visible.map(s => (
// // // //         <div key={s.id} style={{
// // // //           opacity:    applied.includes(s.id) ? 0.45 : 1,
// // // //           transition: 'opacity var(--transition-base)',
// // // //         }}>
// // // //           <SuggestionCard
// // // //             suggestion={s}
// // // //             onApply={handleApply}
// // // //             applying={applying[s.id]}
// // // //           />
// // // //         </div>
// // // //       ))}

// // // //       {/* Apply all button */}
// // // //       <button
// // // //         className="btn btn-primary"
// // // //         style={{ width: '100%' }}
// // // //         onClick={handleApplyAll}
// // // //         disabled={applied.length === suggestions.length || applying.all}
// // // //       >
// // // //         {applying.all
// // // //           ? 'Applying all suggestions...'
// // // //           : applied.length === suggestions.length
// // // //           ? 'All suggestions applied'
// // // //           : `Apply all & download (${suggestions.length - applied.length} left)`}
// // // //       </button>
// // // //     </div>
// // // //   )
// // // // }
// // // // frontend/src/components/ats/SuggestionsPanel.jsx
// // // import { useState } from 'react'
// // // import SuggestionCard from './SuggestionCard'
// // // import toast from 'react-hot-toast'
// // // import axios from '../../lib/axios'   // your configured axios instance (includes auth interceptor)

// // // const FILTERS = ['All', 'Improve', 'Add', 'Remove']

// // // export default function SuggestionsPanel({ suggestions = [], resumeId }) {
// // //   const [filter,   setFilter]   = useState('All')
// // //   const [applied,  setApplied]  = useState([])
// // //   const [applying, setApplying] = useState({}) // tracks individual apply actions

// // //   const visible = filter === 'All'
// // //     ? suggestions
// // //     : suggestions.filter(s => s.type === filter)

// // //   // Apply a single suggestion – backend returns PDF
// // //   async function handleApply(suggestion) {
// // //     if (!resumeId) {
// // //       toast.error('Resume ID missing – please re‑analyze the resume');
// // //       return;
// // //     }
// // //     const suggestionText = suggestion.after;
// // //     setApplying(prev => ({ ...prev, [suggestion.id]: true }));
// // //     try {
// // //       const response = await axios.post(
// // //         '/resume/apply-suggestions',
// // //         { resumeId, suggestions: [suggestionText] },
// // //         { responseType: 'blob' }   // critical: tell axios to treat response as binary blob
// // //       );

// // //       // Create a download link for the PDF
// // //       const blob = new Blob([response.data], { type: 'application/pdf' });
// // //       const url = URL.createObjectURL(blob);
// // //       const a = document.createElement('a');
// // //       a.href = url;
// // //       a.download = 'corrected_resume.pdf';
// // //       a.click();
// // //       URL.revokeObjectURL(url);

// // //       toast.success('Suggestion applied – PDF downloaded');
// // //       setApplied(prev => [...prev, suggestion.id]);
// // //     } catch (err) {
// // //       console.error('Apply error:', err);
// // //       toast.error(err.response?.data?.message || err.message || 'Failed to apply suggestion');
// // //     } finally {
// // //       setApplying(prev => ({ ...prev, [suggestion.id]: false }));
// // //     }
// // //   }

// // //   // Apply all suggestions at once – backend returns PDF
// // //   async function handleApplyAll() {
// // //     if (!resumeId) {
// // //       toast.error('Resume ID missing – please re‑analyze the resume');
// // //       return;
// // //     }
// // //     const allSuggestionTexts = suggestions.map(s => s.after);
// // //     setApplying({ all: true });
// // //     try {
// // //       const response = await axios.post(
// // //         '/resume/apply-suggestions',
// // //         { resumeId, suggestions: allSuggestionTexts },
// // //         { responseType: 'blob' }
// // //       );

// // //       const blob = new Blob([response.data], { type: 'application/pdf' });
// // //       const url = URL.createObjectURL(blob);
// // //       const a = document.createElement('a');
// // //       a.href = url;
// // //       a.download = 'corrected_resume_all_suggestions.pdf';
// // //       a.click();
// // //       URL.revokeObjectURL(url);

// // //       toast.success('All suggestions applied – PDF downloaded');
// // //       setApplied(suggestions.map(s => s.id));
// // //     } catch (err) {
// // //       console.error('Apply all error:', err);
// // //       toast.error(err.response?.data?.message || err.message || 'Failed to apply all suggestions');
// // //     } finally {
// // //       setApplying({ all: false });
// // //     }
// // //   }

// // //   return (
// // //     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

// // //       {/* Header row */}
// // //       <div style={{
// // //         display: 'flex', alignItems: 'center',
// // //         justifyContent: 'space-between', flexWrap: 'wrap',
// // //         gap: 'var(--space-3)',
// // //       }}>
// // //         <p style={{
// // //           fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
// // //           color: 'var(--color-text-primary)'
// // //         }}>
// // //           AI suggestions
// // //           <span style={{
// // //             marginLeft: 'var(--space-2)',
// // //             padding: '1px 8px',
// // //             background: 'var(--color-primary-subtle)',
// // //             color: 'var(--color-primary)',
// // //             borderRadius: 'var(--radius-full)',
// // //             fontSize: 'var(--text-xs)',
// // //           }}>
// // //             {suggestions.length}
// // //           </span>
// // //         </p>

// // //         {/* Filter pills */}
// // //         <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
// // //           {FILTERS.map(f => (
// // //             <button key={f}
// // //               onClick={() => setFilter(f)}
// // //               style={{
// // //                 padding: '4px 12px',
// // //                 fontSize: 'var(--text-xs)',
// // //                 fontWeight: 'var(--weight-medium)',
// // //                 borderRadius: 'var(--radius-full)',
// // //                 border: 'none', cursor: 'pointer',
// // //                 background: filter === f
// // //                   ? 'var(--color-primary)'
// // //                   : 'var(--color-primary-subtle)',
// // //                 color: filter === f
// // //                   ? '#fff'
// // //                   : 'var(--color-primary)',
// // //                 transition: 'background var(--transition-fast)',
// // //               }}
// // //             >
// // //               {f}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Cards */}
// // //       {visible.map(s => (
// // //         <div key={s.id} style={{
// // //           opacity:    applied.includes(s.id) ? 0.45 : 1,
// // //           transition: 'opacity var(--transition-base)',
// // //         }}>
// // //           <SuggestionCard
// // //             suggestion={s}
// // //             onApply={handleApply}
// // //             applying={applying[s.id]}
// // //           />
// // //         </div>
// // //       ))}

// // //       {/* Apply all button */}
// // //       <button
// // //         className="btn btn-primary"
// // //         style={{ width: '100%' }}
// // //         onClick={handleApplyAll}
// // //         disabled={applied.length === suggestions.length || applying.all}
// // //       >
// // //         {applying.all
// // //           ? 'Applying all suggestions...'
// // //           : applied.length === suggestions.length
// // //           ? 'All suggestions applied'
// // //           : `Apply all & download (${suggestions.length - applied.length} left)`}
// // //       </button>
// // //     </div>
// // //   )
// // // }
// // // frontend/src/components/ats/SuggestionsPanel.jsx
// // import { useState } from 'react'
// // import SuggestionCard from './SuggestionCard'
// // import toast from 'react-hot-toast'
// // import api from '../../lib/axios'   // your configured axios instance (auto‑token)

// // const FILTERS = ['All', 'Improve', 'Add', 'Remove']

// // export default function SuggestionsPanel({ suggestions = [], resumeId }) {
// //   const [filter,   setFilter]   = useState('All')
// //   const [applied,  setApplied]  = useState([])
// //   const [applying, setApplying] = useState({}) // tracks individual apply actions

// //   const visible = filter === 'All'
// //     ? suggestions
// //     : suggestions.filter(s => s.type === filter)

// //   // Apply a single suggestion – backend returns PDF
// //   async function handleApply(suggestion) {
// //     if (!resumeId) {
// //       toast.error('Resume ID missing – please re‑analyze the resume');
// //       return;
// //     }
// //     const suggestionText = suggestion.after;
// //     setApplying(prev => ({ ...prev, [suggestion.id]: true }));
// //     try {
// //       const response = await api.post(
// //         '/resume/apply-suggestions',
// //         { resumeId, suggestions: [suggestionText] },
// //         { responseType: 'blob' }   // critical: binary PDF response
// //       );

// //       // Create a download link for the PDF
// //       const blob = new Blob([response.data], { type: 'application/pdf' });
// //       const url = URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = 'corrected_resume.pdf';
// //       a.click();
// //       URL.revokeObjectURL(url);

// //       toast.success('Suggestion applied – PDF downloaded');
// //       setApplied(prev => [...prev, suggestion.id]);
// //     } catch (err) {
// //       console.error('Apply error:', err);
// //       // If the server returns an error (non-2xx), axios may still try to parse JSON,
// //       // but with responseType blob it's tricky. We extract message from error response if possible.
// //       let errorMsg = 'Failed to apply suggestion';
// //       if (err.response?.data) {
// //         // Try to read as text then parse JSON
// //         const text = await err.response.data.text();
// //         try {
// //           const json = JSON.parse(text);
// //           errorMsg = json.message || errorMsg;
// //         } catch {
// //           errorMsg = text || errorMsg;
// //         }
// //       } else {
// //         errorMsg = err.message;
// //       }
// //       toast.error(errorMsg);
// //     } finally {
// //       setApplying(prev => ({ ...prev, [suggestion.id]: false }));
// //     }
// //   }

// //   // Apply all suggestions at once – backend returns PDF
// //   async function handleApplyAll() {
// //     if (!resumeId) {
// //       toast.error('Resume ID missing – please re‑analyze the resume');
// //       return;
// //     }
// //     const allSuggestionTexts = suggestions.map(s => s.after);
// //     setApplying({ all: true });
// //     try {
// //       const response = await api.post(
// //         '/resume/apply-suggestions',
// //         { resumeId, suggestions: allSuggestionTexts },
// //         { responseType: 'blob' }
// //       );

// //       const blob = new Blob([response.data], { type: 'application/pdf' });
// //       const url = URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = 'corrected_resume_all_suggestions.pdf';
// //       a.click();
// //       URL.revokeObjectURL(url);

// //       toast.success('All suggestions applied – PDF downloaded');
// //       setApplied(suggestions.map(s => s.id));
// //     } catch (err) {
// //       console.error('Apply all error:', err);
// //       let errorMsg = 'Failed to apply all suggestions';
// //       if (err.response?.data) {
// //         const text = await err.response.data.text();
// //         try {
// //           const json = JSON.parse(text);
// //           errorMsg = json.message || errorMsg;
// //         } catch {
// //           errorMsg = text || errorMsg;
// //         }
// //       } else {
// //         errorMsg = err.message;
// //       }
// //       toast.error(errorMsg);
// //     } finally {
// //       setApplying({ all: false });
// //     }
// //   }

// //   return (
// //     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

// //       {/* Header row */}
// //       <div style={{
// //         display: 'flex', alignItems: 'center',
// //         justifyContent: 'space-between', flexWrap: 'wrap',
// //         gap: 'var(--space-3)',
// //       }}>
// //         <p style={{
// //           fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
// //           color: 'var(--color-text-primary)'
// //         }}>
// //           AI suggestions
// //           <span style={{
// //             marginLeft: 'var(--space-2)',
// //             padding: '1px 8px',
// //             background: 'var(--color-primary-subtle)',
// //             color: 'var(--color-primary)',
// //             borderRadius: 'var(--radius-full)',
// //             fontSize: 'var(--text-xs)',
// //           }}>
// //             {suggestions.length}
// //           </span>
// //         </p>

// //         {/* Filter pills */}
// //         <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
// //           {FILTERS.map(f => (
// //             <button key={f}
// //               onClick={() => setFilter(f)}
// //               style={{
// //                 padding: '4px 12px',
// //                 fontSize: 'var(--text-xs)',
// //                 fontWeight: 'var(--weight-medium)',
// //                 borderRadius: 'var(--radius-full)',
// //                 border: 'none', cursor: 'pointer',
// //                 background: filter === f
// //                   ? 'var(--color-primary)'
// //                   : 'var(--color-primary-subtle)',
// //                 color: filter === f
// //                   ? '#fff'
// //                   : 'var(--color-primary)',
// //                 transition: 'background var(--transition-fast)',
// //               }}
// //             >
// //               {f}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Cards */}
// //       {visible.map(s => (
// //         <div key={s.id} style={{
// //           opacity:    applied.includes(s.id) ? 0.45 : 1,
// //           transition: 'opacity var(--transition-base)',
// //         }}>
// //           <SuggestionCard
// //             suggestion={s}
// //             onApply={handleApply}
// //             applying={applying[s.id]}
// //           />
// //         </div>
// //       ))}

// //       {/* Apply all button */}
// //       <button
// //         className="btn btn-primary"
// //         style={{ width: '100%' }}
// //         onClick={handleApplyAll}
// //         disabled={applied.length === suggestions.length || applying.all}
// //       >
// //         {applying.all
// //           ? 'Applying all suggestions...'
// //           : applied.length === suggestions.length
// //           ? 'All suggestions applied'
// //           : `Apply all & download (${suggestions.length - applied.length} left)`}
// //       </button>
// //     </div>
// //   )
// // }
// // frontend/src/components/ats/SuggestionsPanel.jsx
// import { useState } from 'react'
// import SuggestionCard from './SuggestionCard'
// import toast from 'react-hot-toast'
// import api from '../../lib/axios'

// const FILTERS = ['All', 'Improve', 'Add', 'Remove']

// export default function SuggestionsPanel({ suggestions = [], resumeId }) {
//   const [filter, setFilter] = useState('All')
//   const [applied, setApplied] = useState([])       // ids that have been applied (visual only)
//   const [applying, setApplying] = useState({})
//   const [removedIds, setRemovedIds] = useState([])   // ids of suggestions the user has removed

//   // Show only non‑removed suggestions, then apply filter
//   const visibleSuggestions = suggestions.filter(s => !removedIds.includes(s.id))
//   const visible = filter === 'All'
//     ? visibleSuggestions
//     : visibleSuggestions.filter(s => s.type === filter)

//   // Remove a suggestion (hide it)
//   function handleRemove(suggestion) {
//     setRemovedIds(prev => [...prev, suggestion.id])
//     toast.success(`Suggestion removed – it will not be applied`, { icon: '🗑️' })
//   }

//   // Restore all removed suggestions
//   function handleRestoreAll() {
//     setRemovedIds([])
//     toast.success('All removed suggestions restored', { icon: '↺' })
//   }

//   // Apply a single suggestion (still works, but uses original suggestions)
//   async function handleApply(suggestion) {
//     if (!resumeId) {
//       toast.error('Resume ID missing – please re‑analyze the resume');
//       return;
//     }
//     const suggestionText = suggestion.after;
//     setApplying(prev => ({ ...prev, [suggestion.id]: true }));
//     try {
//       const response = await api.post(
//         '/resume/apply-suggestions',
//         { resumeId, suggestions: [suggestionText] },
//         { responseType: 'blob' }
//       );
//       const blob = new Blob([response.data], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'corrected_resume.txt';
//       a.click();
//       URL.revokeObjectURL(url);
//       toast.success(`Suggestion applied – text file downloaded`);
//       setApplied(prev => [...prev, suggestion.id]);
//     } catch (err) {
//       let errorMsg = 'Failed to apply suggestion';
//       if (err.response?.data) {
//         const text = await err.response.data.text();
//         try {
//           const json = JSON.parse(text);
//           errorMsg = json.message || errorMsg;
//         } catch { errorMsg = text || errorMsg; }
//       } else { errorMsg = err.message; }
//       toast.error(errorMsg);
//     } finally {
//       setApplying(prev => ({ ...prev, [suggestion.id]: false }));
//     }
//   }

//   // Apply only the suggestions that have NOT been removed
//   async function handleApplyAll() {
//     if (!resumeId) {
//       toast.error('Resume ID missing – please re‑analyze the resume');
//       return;
//     }
//     const keptSuggestions = suggestions.filter(s => !removedIds.includes(s.id));
//     if (keptSuggestions.length === 0) {
//       toast.error('No suggestions left to apply – restore removed ones first');
//       return;
//     }
//     const allSuggestionTexts = keptSuggestions.map(s => s.after);
//     setApplying({ all: true });
//     try {
//       const response = await api.post(
//         '/resume/apply-suggestions',
//         { resumeId, suggestions: allSuggestionTexts },
//         { responseType: 'blob' }
//       );
//       const blob = new Blob([response.data], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'corrected_resume_all_suggestions.txt';
//       a.click();
//       URL.revokeObjectURL(url);
//       toast.success(`All kept suggestions applied – text file downloaded`);
//       setApplied(keptSuggestions.map(s => s.id));
//     } catch (err) {
//       let errorMsg = 'Failed to apply all suggestions';
//       if (err.response?.data) {
//         const text = await err.response.data.text();
//         try { errorMsg = JSON.parse(text).message || errorMsg; } catch { errorMsg = text || errorMsg; }
//       } else { errorMsg = err.message; }
//       toast.error(errorMsg);
//     } finally {
//       setApplying({ all: false });
//     }
//   }

//   const removedCount = removedIds.length;
//   const keptCount = suggestions.length - removedCount;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

//       {/* Header row with restore button if any removed */}
//       <div style={{
//         display: 'flex', alignItems: 'center',
//         justifyContent: 'space-between', flexWrap: 'wrap',
//         gap: 'var(--space-3)',
//       }}>
//         <p style={{
//           fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
//           color: 'var(--color-text-primary)'
//         }}>
//           AI suggestions
//           <span style={{
//             marginLeft: 'var(--space-2)',
//             padding: '1px 8px',
//             background: 'var(--color-primary-subtle)',
//             color: 'var(--color-primary)',
//             borderRadius: 'var(--radius-full)',
//             fontSize: 'var(--text-xs)',
//           }}>
//             {keptCount} / {suggestions.length}
//           </span>
//           {removedCount > 0 && (
//             <button
//               onClick={handleRestoreAll}
//               style={{
//                 marginLeft: 'var(--space-3)',
//                 fontSize: 'var(--text-xs)',
//                 padding: '2px 8px',
//                 background: 'var(--color-warning-bg)',
//                 color: 'var(--color-warning)',
//                 border: 'none',
//                 borderRadius: 'var(--radius-full)',
//                 cursor: 'pointer',
//               }}
//             >
//               ↺ Restore {removedCount} removed
//             </button>
//           )}
//         </p>

//         {/* Filter pills */}
//         <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
//           {FILTERS.map(f => (
//             <button key={f}
//               onClick={() => setFilter(f)}
//               style={{
//                 padding: '4px 12px',
//                 fontSize: 'var(--text-xs)',
//                 fontWeight: 'var(--weight-medium)',
//                 borderRadius: 'var(--radius-full)',
//                 border: 'none', cursor: 'pointer',
//                 background: filter === f
//                   ? 'var(--color-primary)'
//                   : 'var(--color-primary-subtle)',
//                 color: filter === f ? '#fff' : 'var(--color-primary)',
//               }}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Cards */}
//       {visible.map(s => (
//         <div key={s.id} style={{
//           opacity: applied.includes(s.id) ? 0.45 : 1,
//           transition: 'opacity var(--transition-base)',
//         }}>
//           <SuggestionCard
//             suggestion={s}
//             onApply={handleApply}
//             onRemove={handleRemove}        // new prop
//             applying={applying[s.id]}
//           />
//         </div>
//       ))}

//       {/* Apply all button – shows how many will be applied */}
//       <button
//         className="btn btn-primary"
//         style={{ width: '100%' }}
//         onClick={handleApplyAll}
//         disabled={keptCount === 0 || applying.all}
//       >
//         {applying.all
//           ? 'Applying suggestions...'
//           : keptCount === suggestions.length
//           ? `Apply all & download (${keptCount} suggestions)`
//           : `Apply kept suggestions & download (${keptCount} of ${suggestions.length})`}
//       </button>
//     </div>
//   )
// }