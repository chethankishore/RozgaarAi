// src/components/ats/SuggestionCard.jsx
const TYPE_STYLES = {
  Improve: { bg: '#FCE4D6', color: '#712B13' },
  Add:     { bg: '#EAF3DE', color: '#27500A' },
  Remove:  { bg: '#FCEBEB', color: '#791F1F' },
}

const PRIORITY_COLOR = {
  High:   'var(--color-danger)',
  Medium: 'var(--color-warning)',
  Low:    'var(--color-text-tertiary)',
}

export default function SuggestionCard({ suggestion, onApply, onRemove, applying }) {
  const { type, section, priority, before, after } = suggestion
  const typeStyle = TYPE_STYLES[type] || TYPE_STYLES.Improve

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-bg-surface-2)',
        borderBottom: '1px solid var(--color-border-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{
            padding: '2px 10px', borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
            background: typeStyle.bg, color: typeStyle.color,
          }}>
            {type || 'Improve'}
          </span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>
            {section || 'General'}
          </span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: PRIORITY_COLOR[priority] || 'var(--color-text-tertiary)' }}>
          {priority || 'Medium'} priority
        </span>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        {before && (
          <>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Before</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface-2)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)' }}>
              "{before}"
            </p>
          </>
        )}
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
          {before ? 'After' : 'Suggestion'}
        </p>
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
          background: 'var(--color-success-bg)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)',
          marginBottom: 'var(--space-3)',
        }}>
          {after}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onApply(suggestion)} disabled={applying} style={{ borderColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
            {applying ? 'Applying...' : 'Apply suggestion'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onRemove(suggestion)} style={{ borderColor: 'var(--color-danger-muted)', color: 'var(--color-danger)' }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
// // const TYPE_STYLES = {
// //   Improve: { bg: '#FCE4D6', color: '#712B13' },
// //   Add:     { bg: '#EAF3DE', color: '#27500A' },
// //   Remove:  { bg: '#FCEBEB', color: '#791F1F' },
// // }

// // const PRIORITY_COLOR = {
// //   High:   'var(--color-danger)',
// //   Medium: 'var(--color-warning)',
// //   Low:    'var(--color-text-tertiary)',
// // }

// // export default function SuggestionCard({ suggestion, onApply }) {
// //   const { type, section, priority, before, after } = suggestion
// //   const typeStyle = TYPE_STYLES[type] || TYPE_STYLES.Improve

// //   return (
// //     <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

// //       {/* Header */}
// //       <div style={{
// //         display: 'flex', alignItems: 'center',
// //         justifyContent: 'space-between',
// //         padding: 'var(--space-3) var(--space-4)',
// //         background: 'var(--color-bg-surface-2)',
// //         borderBottom: '1px solid var(--color-border-surface)',
// //       }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
// //           <span style={{
// //             padding: '2px 10px', borderRadius: 'var(--radius-full)',
// //             fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
// //             background: typeStyle.bg, color: typeStyle.color,
// //           }}>
// //             {type}
// //           </span>
// //           <span style={{
// //             fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
// //             color: 'var(--color-text-primary)'
// //           }}>
// //             {section}
// //           </span>
// //         </div>
// //         <span style={{ fontSize: 'var(--text-xs)', color: PRIORITY_COLOR[priority] }}>
// //           {priority} priority
// //         </span>
// //       </div>

// //       {/* Body */}
// //       <div style={{ padding: 'var(--space-4)' }}>
// //         {before && (
// //           <>
// //             <p style={{
// //               fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
// //               marginBottom: 'var(--space-1)'
// //             }}>
// //               Before
// //             </p>
// //             <p style={{
// //               fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
// //               background: 'var(--color-bg-surface-2)',
// //               borderRadius: 'var(--radius-sm)',
// //               padding: 'var(--space-2) var(--space-3)',
// //               marginBottom: 'var(--space-3)',
// //               lineHeight: 'var(--line-normal)',
// //             }}>
// //               "{before}"
// //             </p>
// //           </>
// //         )}

// //         <p style={{
// //           fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
// //           marginBottom: 'var(--space-1)'
// //         }}>
// //           {before ? 'After' : 'Suggestion'}
// //         </p>
// //         <p style={{
// //           fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
// //           background: 'var(--color-success-bg)',
// //           border: '1px solid rgba(34,197,94,0.2)',
// //           borderRadius: 'var(--radius-sm)',
// //           padding: 'var(--space-2) var(--space-3)',
// //           marginBottom: 'var(--space-3)',
// //           lineHeight: 'var(--line-normal)',
// //         }}>
// //           {after}
// //         </p>

// //         <button
// //           className="btn btn-ghost btn-sm"
// //           onClick={() => onApply(suggestion)}
// //           style={{ borderColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}
// //         >
// //           Apply suggestion
// //         </button>
        
// //       </div>
// //     </div>
// //   )
// // }
// // frontend/src/components/ats/SuggestionCard.jsx
// // const TYPE_STYLES = {
// //   Improve: { bg: '#FCE4D6', color: '#712B13' },
// //   Add:     { bg: '#EAF3DE', color: '#27500A' },
// //   Remove:  { bg: '#FCEBEB', color: '#791F1F' },
// // }

// // const PRIORITY_COLOR = {
// //   High:   'var(--color-danger)',
// //   Medium: 'var(--color-warning)',
// //   Low:    'var(--color-text-tertiary)',
// // }

// // export default function SuggestionCard({ suggestion, onApply, onRemove, applying }) {
// //   const { type, section, priority, before, after } = suggestion
// //   const typeStyle = TYPE_STYLES[type] || TYPE_STYLES.Improve

// //   return (
// //     <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

// //       {/* Header */}
// //       <div style={{
// //         display: 'flex', alignItems: 'center',
// //         justifyContent: 'space-between',
// //         padding: 'var(--space-3) var(--space-4)',
// //         background: 'var(--color-bg-surface-2)',
// //         borderBottom: '1px solid var(--color-border-surface)',
// //       }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
// //           <span style={{
// //             padding: '2px 10px', borderRadius: 'var(--radius-full)',
// //             fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
// //             background: typeStyle.bg, color: typeStyle.color,
// //           }}>
// //             {type || 'Improve'}
// //           </span>
// //           <span style={{
// //             fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
// //             color: 'var(--color-text-primary)'
// //           }}>
// //             {section || 'General'}
// //           </span>
// //         </div>
// //         <span style={{ fontSize: 'var(--text-xs)', color: PRIORITY_COLOR[priority] || 'var(--color-text-tertiary)' }}>
// //           {priority || 'Medium'} priority
// //         </span>
// //       </div>

// //       {/* Body */}
// //       <div style={{ padding: 'var(--space-4)' }}>
// //         {before && (
// //           <>
// //             <p style={{
// //               fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
// //               marginBottom: 'var(--space-1)'
// //             }}>
// //               Before
// //             </p>
// //             <p style={{
// //               fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
// //               background: 'var(--color-bg-surface-2)',
// //               borderRadius: 'var(--radius-sm)',
// //               padding: 'var(--space-2) var(--space-3)',
// //               marginBottom: 'var(--space-3)',
// //               lineHeight: 'var(--line-normal)',
// //             }}>
// //               "{before}"
// //             </p>
// //           </>
// //         )}

// //         <p style={{
// //           fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
// //           marginBottom: 'var(--space-1)'
// //         }}>
// //           {before ? 'After' : 'Suggestion'}
// //         </p>
// //         <p style={{
// //           fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
// //           background: 'var(--color-success-bg)',
// //           border: '1px solid rgba(34,197,94,0.2)',
// //           borderRadius: 'var(--radius-sm)',
// //           padding: 'var(--space-2) var(--space-3)',
// //           marginBottom: 'var(--space-3)',
// //           lineHeight: 'var(--line-normal)',
// //         }}>
// //           {after}
// //         </p>

// //         <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
// //           <button
// //             className="btn btn-ghost btn-sm"
// //             onClick={() => onApply(suggestion)}
// //             disabled={applying}
// //             style={{ borderColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}
// //           >
// //             {applying ? 'Applying...' : 'Apply suggestion'}
// //           </button>
// //           <button
// //             className="btn btn-ghost btn-sm"
// //             onClick={() => onRemove(suggestion)}
// //             style={{ borderColor: 'var(--color-danger-muted)', color: 'var(--color-danger)' }}
// //           >
// //             Remove
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
// // frontend/src/components/ats/SuggestionCard.jsx
// const TYPE_STYLES = {
//   Improve: { bg: '#FCE4D6', color: '#712B13' },
//   Add:     { bg: '#EAF3DE', color: '#27500A' },
//   Remove:  { bg: '#FCEBEB', color: '#791F1F' },
// }

// const PRIORITY_COLOR = {
//   High:   'var(--color-danger)',
//   Medium: 'var(--color-warning)',
//   Low:    'var(--color-text-tertiary)',
// }

// export default function SuggestionCard({ suggestion, onApply, onRemove, applying }) {
//   const { type, section, priority, before, after } = suggestion
//   const typeStyle = TYPE_STYLES[type] || TYPE_STYLES.Improve

//   return (
//     <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
//       <div style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: 'var(--space-3) var(--space-4)',
//         background: 'var(--color-bg-surface-2)',
//         borderBottom: '1px solid var(--color-border-surface)',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
//           <span style={{
//             padding: '2px 10px', borderRadius: 'var(--radius-full)',
//             fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
//             background: typeStyle.bg, color: typeStyle.color,
//           }}>
//             {type || 'Improve'}
//           </span>
//           <span style={{
//             fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
//             color: 'var(--color-text-primary)'
//           }}>
//             {section || 'General'}
//           </span>
//         </div>
//         <span style={{ fontSize: 'var(--text-xs)', color: PRIORITY_COLOR[priority] || 'var(--color-text-tertiary)' }}>
//           {priority || 'Medium'} priority
//         </span>
//       </div>

//       <div style={{ padding: 'var(--space-4)' }}>
//         {before && (
//           <>
//             <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
//               Before
//             </p>
//             <p style={{
//               fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
//               background: 'var(--color-bg-surface-2)', borderRadius: 'var(--radius-sm)',
//               padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)',
//             }}>
//               "{before}"
//             </p>
//           </>
//         )}
//         <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
//           {before ? 'After' : 'Suggestion'}
//         </p>
//         <p style={{
//           fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
//           background: 'var(--color-success-bg)', border: '1px solid rgba(34,197,94,0.2)',
//           borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)',
//           marginBottom: 'var(--space-3)',
//         }}>
//           {after}
//         </p>
//         <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => onApply(suggestion)}
//             disabled={applying}
//             style={{ borderColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}
//           >
//             {applying ? 'Applying...' : 'Apply suggestion'}
//           </button>
//           <button
//             className="btn btn-ghost btn-sm"
//             onClick={() => onRemove(suggestion)}
//             style={{ borderColor: 'var(--color-danger-muted)', color: 'var(--color-danger)' }}
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }