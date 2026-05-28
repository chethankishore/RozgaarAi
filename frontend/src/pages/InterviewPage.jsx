// src/pages/InterviewPage.jsx
import { useState, useCallback, useEffect } from 'react'
import CategoryTabs from '../components/interview/CategoryTabs'
import QuestionCard from '../components/interview/QuestionCard'
import QuestionList from '../components/interview/QuestionList'
import { Skeleton, EmptyState } from '../components/ui'
import toast from 'react-hot-toast'

// ─── Role‑specific question banks ─────────────────────────────────────────
const QUESTION_BANK = {
  swe: {   // Software Engineer
    Technical: [
      { text: "Design a REST API for a resume upload service. What endpoints would you include?", tip: "Did you mention: POST /upload, file validation, 400/413/500 error codes?" },
      { text: "Explain the difference between SQL and NoSQL. When would you use each?", tip: "Give real use‑cases, not just definitions." },
      { text: "How does React's virtual DOM work and why does it improve performance?", tip: "Mention diffing, reconciliation, batching." },
      { text: "Explain time complexity with an example from your own code.", tip: "Use O(n), O(log n), or O(n²) in a real scenario." },
    ],
    Behavioural: [
      { text: "Tell me about a challenging bug you fixed and how you approached it.", tip: "Include how you found it, tools used, and what you learned." },
      { text: "Where do you see yourself in 5 years?", tip: "Tie it to the role and show growth mindset." },
      { text: "Describe a time you disagreed with a teammate. How did you resolve it?", tip: "Show empathy, communication, positive outcome." },
      { text: "Tell me about a time you had to learn something new very quickly.", tip: "Explain what you learned, how fast, and the outcome." },
    ],
    'Gap-based': [
      { text: "You lack Docker experience. How would you get up to speed if hired?", tip: "Mention a specific learning plan and a project you'd build." },
      { text: "Your resume shows no CI/CD experience. How would you contribute to our pipeline?", tip: "Mention GitHub Actions, Jenkins, or willingness to learn." },
      { text: "You have never worked with microservices. What steps would you take?", tip: "Online courses, side projects, or pair programming." },
    ]
  },
  da: {    // Data Analyst
    Technical: [
      { text: "What is the difference between INNER JOIN and LEFT JOIN in SQL?", tip: "Explain with a simple example of two tables." },
      { text: "How do you handle missing data in a dataset?", tip: "Imputation, deletion, or using algorithms that handle NaN." },
      { text: "Explain the concept of data normalization (1NF, 2NF, 3NF).", tip: "Why they are used – reduce redundancy." },
      { text: "What is the difference between a bar chart and a histogram?", tip: "Bar chart for categorical, histogram for continuous data." },
    ],
    Behavioural: [
      { text: "Describe a time you presented data insights to non‑technical stakeholders.", tip: "Focus on storytelling and simplification." },
      { text: "How do you ensure the accuracy of your analysis?", tip: "Data validation, peer review, and cross‑checking." },
    ],
    'Gap-based': [
      { text: "You are unfamiliar with Power BI. What steps would you take?", tip: "Certifications, practice projects, online tutorials." },
      { text: "Your resume lacks Python for data analysis. How would you upskill?", tip: "Pandas, NumPy, or a small portfolio project." },
    ]
  },
  pm: {    // Product Manager
    Technical: [
      { text: "How would you prioritize features for a new product?", tip: "RICE model, MoSCoW, Kano model." },
      { text: "What metrics would you track after launching a feature?", tip: "Engagement, retention, conversion, NPS." },
    ],
    Behavioural: [
      { text: "Tell me about a product you shipped that failed. What did you learn?", tip: "Mention data‑driven decisions and iteration." },
      { text: "How do you handle conflicting stakeholder priorities?", tip: "Show negotiation and data‑backed trade‑offs." },
    ],
    'Gap-based': [
      { text: "You have no experience with A/B testing. How would you learn?", tip: "Online courses, reading case studies, or running a personal experiment." },
    ]
  }
}

// Helper: get all questions for a role (flatten categories if needed)
function getAllQuestionsForRole(roleKey) {
  const bank = QUESTION_BANK[roleKey] || QUESTION_BANK.swe
  return Object.entries(bank).flatMap(([category, qs]) =>
    qs.map(q => ({ ...q, category, id: crypto.randomUUID?.() || Math.random() }))
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function InterviewPage() {
  const [role,      setRole]      = useState('')
  const [category,  setCategory]  = useState('All')
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [done,      setDone]      = useState([])
  const [skipped,   setSkipped]   = useState([])

  // Build question set based on role and category
  const buildSet = useCallback((roleKey, cat) => {
    if (!roleKey) return []
    let pool = []
    const bank = QUESTION_BANK[roleKey] || QUESTION_BANK.swe
    if (cat === 'All') {
      pool = Object.entries(bank).flatMap(([catName, qs]) =>
        qs.map(q => ({ ...q, category: catName, id: crypto.randomUUID?.() || Math.random() }))
      )
    } else {
      pool = (bank[cat] || []).map(q => ({ ...q, category: cat, id: crypto.randomUUID?.() || Math.random() }))
    }
    return shuffle(pool)
  }, [])

  // Regenerate when role changes if already in practice mode
  useEffect(() => {
    if (generated && role) {
      const newQuestions = buildSet(role, category)
      setQuestions(newQuestions)
      setCurrent(0)
      setDone([])
      setSkipped([])
    }
  }, [role, generated, category, buildSet])

  function handleCategoryChange(cat) {
    setCategory(cat)
    if (generated && role) {
      const newQuestions = buildSet(role, cat)
      setQuestions(newQuestions)
      setCurrent(0)
      setDone([])
      setSkipped([])
    }
  }

  async function handleGenerate() {
    if (!role) {
      toast.error('Please select a role first')
      return
    }
    setLoading(true)
    // Simulate async (later replace with API call to AI)
    await new Promise(r => setTimeout(r, 500))
    const newQuestions = buildSet(role, category)
    setQuestions(newQuestions)
    setCurrent(0)
    setDone([])
    setSkipped([])
    setGenerated(true)
    setLoading(false)
  }

  function handleNext() {
    setDone(prev => prev.includes(current) ? prev : [...prev, current])
    setCurrent(i => Math.min(i + 1, questions.length - 1))
  }

  function handlePrev() {
    setCurrent(i => Math.max(i - 1, 0))
  }

  function handleSkip() {
    setSkipped(prev => prev.includes(current) ? prev : [...prev, current])
    setCurrent(i => Math.min(i + 1, questions.length - 1))
    toast('Question skipped', { icon: '↪' })
  }

  function handleSelect(i) {
    setCurrent(i)
  }

  const answered = done.length
  const skippedCount = skipped.length
  const left = questions.length - answered - skippedCount

  return (
    <div style={{
      maxWidth: 'var(--container-max)',
      margin:   '0 auto',
      padding:  'var(--space-8) var(--container-pad)',
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'flex-start',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            'var(--space-4)',
        marginBottom:   'var(--space-6)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
            Interview prep
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Practice with a timer. Analyze yourself honestly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              height: 40, padding: '0 var(--space-4)',
              fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', outline: 'none',
            }}
          >
            <option value="">Select a role</option>
            <option value="swe">Software Engineer</option>
            <option value="da">Data Analyst</option>
            <option value="pm">Product Manager</option>
          </select>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Shuffling…' : generated ? 'Reshuffle' : 'Start practice'}
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <CategoryTabs active={category} onChange={handleCategoryChange} />
      </div>

      {/* States */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <Skeleton height="500px" radius="var(--radius-lg)" />
          <Skeleton height="500px" radius="var(--radius-lg)" />
        </div>
      ) : !generated ? (
        <EmptyState
          title="Ready when you are"
          description="Select a role, pick a category, and hit Start practice. Questions will be shuffled randomly."
        />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions in this category"
          description="Try All or a different category tab"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          <QuestionCard
            question={questions[current]}
            index={current}
            total={questions.length}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={handleSkip}
          />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {answered} answered · {skippedCount} skipped · {left} left
              </p>
              <div style={{ width: 100 }}>
                <div className="progress-track">
                  <div className="progress-fill success" style={{ width: `${(answered / questions.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <QuestionList
              questions={questions}
              currentIndex={current}
              doneIndexes={done}
              skippedIndexes={skipped}
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}
    </div>
  )
}