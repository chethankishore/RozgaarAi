// src/pages/ATSPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SourceToggle from '../components/ats/SourceToggle';
import ScorePanel from '../components/ats/ScorePanel';
import SuggestionsPanel from '../components/ats/SuggestionsPanel';
import * as resumeService from '../services/resumeService';
import api from '../lib/axios';

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'Product Manager',
  'UX Designer', 'DevOps Engineer', 'Full Stack Developer', 'Others'
];

function authToast(message, icon = '🔒') {
  toast(message, { icon, position: 'top-center', duration: 1500 });
}

function uploadToast() {
  toast.error('Upload your resume first', { icon: '📄', position: 'top-center' });
}

export default function ATSPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeIdFromUrl = searchParams.get('resumeId');

  // UI states
  const [source, setSource] = useState('upload');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  // If viewing an existing resume
  const [viewingResumeId, setViewingResumeId] = useState(resumeIdFromUrl);
  const [viewingResume, setViewingResume] = useState(null);

  const activeRole = role === 'Others' ? customRole : role;

  // Redirect to login if not authenticated
  function redirectToLogin() { navigate('/login', { replace: true }); }
  function requireAuth() {
    if (!token) { authToast('Log in to use this feature'); redirectToLogin(); return false; }
    return true;
  }

  // Fetch existing resume when resumeId is in URL
  useEffect(() => {
    if (viewingResumeId && token) {
      fetchExistingResume(viewingResumeId);
    }
  }, [viewingResumeId, token]);

  const fetchExistingResume = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/resume/${id}`);
      const resume = response.data.data;
      setViewingResume(resume);
      setResumeId(resume._id);

      // Transform resume data into the format expected by the UI
      setResult({
        atsScore: resume.atsScore || 0,
        jobRole: activeRole || 'General',
        breakdown: resume.atsResult?.scoreBreakdown
          ? [{ label: 'Formatting score', value: resume.atsResult.scoreBreakdown.score || 0 }]
          : [],
        keywords: {
          present: resume.atsResult?.keywordsMatched || [],
          missing: resume.atsResult?.missingKeywords || [],
        },
        jdMatch: {
          score: resume.atsScore || 0,
          present: resume.atsResult?.keywordsMatched || [],
          missing: resume.atsResult?.missingKeywords || [],
        },
        suggestions: (resume.suggestions || []).map((s, idx) => ({
          id: idx + 1,
          section: '',
          type: 'Improve',
          priority: '',
          before: null,
          after: s,
        })),
        summary: resume.summary || '',
        strengths: resume.strengths || [],
        weaknesses: resume.weaknesses || [],
        improvementTips: resume.improvementTips || [],
      });
    } catch (err) {
      console.error('Load resume error:', err);
      toast.error('Failed to load resume details');
    } finally {
      setLoading(false);
    }
  };

  // File handling
  function handleDrop(e) { e.preventDefault(); if (!requireAuth()) return; const f = e.dataTransfer.files[0]; if (f) processFile(f); }
  function handleDragOver(e) { e.preventDefault(); }
  function handleDropzoneClick() { if (!requireAuth()) return; document.getElementById('resume-file-input').click(); }
  function handleFileInputChange(e) { const f = e.target.files[0]; if (f) processFile(f); }

  function processFile(f) {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      toast.error('Only PDF or DOC/DOCX files allowed', { position: 'top-center' });
      return;
    }
    setFile(f);
    setFileName(f.name);
  }

  function handleLinkedInUrlChange(val) { setLinkedInUrl(val); }
  function handleLinkedInImport() { if (!requireAuth()) return; console.log('linkedin import:', linkedInUrl); }
  function handleRoleChange(val) { if (!requireAuth()) return; setRole(val); setCustomRole(''); }
  function handleCustomRoleChange(val) { if (!requireAuth()) return; setCustomRole(val); }
  function handleJdChange(val) { if (!requireAuth()) return; setJdText(val); }
  function handleSourceChange(val) { if (!requireAuth()) return; setSource(val); setFile(null); setFileName(null); setViewingResumeId(null); setResult(null); }

  async function handleAnalyze() {
    if (!requireAuth()) return;
    if (!file && source === 'upload') { uploadToast(); return; }
    if (!jdText) { toast.error('Paste or enter a job description', { position: 'top-center' }); return; }
    setLoading(true);
    try {
      const data = await resumeService.analyze({ file, jdText, token });
      if (data.resume?._id) setResumeId(data.resume._id);
      const rawSuggestions = data.analysis?.suggestions || [];
      const formattedSuggestions = rawSuggestions.map((text, idx) => ({
        id: idx + 1,
        section: 'General',
        type: 'Improve',
        priority: 'Medium',
        before: null,
        after: text,
      }));
      setResult({
        atsScore: data.analysis?.atsScore ?? 0,
        jobRole: activeRole || 'General',
        breakdown: data.analysis?.formatting?.score ? [{ label: 'Formatting score', value: data.analysis.formatting.score }] : [],
        keywords: {
          present: data.analysis?.keywords?.found || [],
          missing: data.analysis?.keywords?.missing || [],
        },
        jdMatch: {
          score: data.analysis?.atsScore ?? 0,
          present: data.analysis?.keywords?.found || [],
          missing: data.analysis?.keywords?.missing || [],
        },
        suggestions: formattedSuggestions,
        summary: data.analysis?.summary || '',
        strengths: data.analysis?.strengths || [],
        weaknesses: data.analysis?.weaknesses || [],
        improvementTips: data.analysis?.improvementTips || [],
      });
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  // If viewing an existing resume, hide the upload/role/JD section and show the analysis only
  const isViewing = !!viewingResumeId;

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-1)' }}>{isViewing ? 'Resume Analysis' : 'Check your ATS score'}</h2>
        <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
          {isViewing ? 'Viewing previous analysis' : 'Upload your resume, add a job description, and get instant AI analysis'}
        </p>
      </div>

      {!isViewing && (
        <>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <SourceToggle active={source} onChange={handleSourceChange} />
          </div>

          {/* Upload zone */}
          {source === 'upload' && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div className="dropzone" onClick={handleDropzoneClick} onDrop={handleDrop} onDragOver={handleDragOver}>
                <input id="resume-file-input" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileInputChange} />
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto var(--space-3)' }}>
                  <rect width="36" height="36" rx="10" fill="var(--color-primary-subtle)"/>
                  <path d="M18 24v-9M15 18l3-3 3 3" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 27h12" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                </svg>
                {fileName ? (
                  <>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-primary)' }}>{fileName}</p>
                    <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Click to change file</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                      Drag &amp; drop your resume here
                    </p>
                    <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>PDF or DOC · max 5MB</p>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); handleDropzoneClick(); }}>Browse files</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* LinkedIn import (simplified) */}
          {source === 'linkedin' && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-4)' }}>Paste your LinkedIn profile URL</p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 480, margin: '0 auto' }}>
                  <input className="input" placeholder="https://linkedin.com/in/yourname" value={linkedInUrl} onChange={e => handleLinkedInUrlChange(e.target.value)} />
                  <button className="btn btn-primary btn-sm" onClick={handleLinkedInImport}>Import</button>
                </div>
                <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>Or upload your LinkedIn PDF export below</p>
                <div className="dropzone" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-5)' }} onClick={handleDropzoneClick} onDrop={handleDrop} onDragOver={handleDragOver}>
                  <input id="resume-file-input" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileInputChange} />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{fileName ? fileName : 'Drop LinkedIn PDF export here'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role + JD card */}
          <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Target role</label>
              <select value={role} onChange={e => handleRoleChange(e.target.value)} className="input" style={{ width: 220, height: 44, cursor: 'pointer' }}>
                <option value="">Select a role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {role === 'Others' && <input className="input" style={{ width: 220 }} placeholder="Type your job role..." value={customRole} onChange={e => handleCustomRoleChange(e.target.value)} autoFocus />}
            </div>
            <div style={{ height: 1, background: 'var(--color-border-surface)', marginBottom: 'var(--space-5)' }} />
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                Job description
                <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-regular)', marginLeft: 'var(--space-2)' }}>optional — paste the JD to get a match score</span>
              </label>
              <textarea className="input textarea" rows={5} placeholder="Paste the full job description here..." value={jdText} onChange={e => handleJdChange(e.target.value)} />
              {jdText.trim().length > 0 && <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>{jdText.trim().split(/\s+/).length} words · JD match will run automatically</p>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>{loading ? 'Analyzing…' : 'Analyze resume'}</button>
            </div>
          </div>
        </>
      )}

      {/* Results */}
      {(loading || result) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {loading ? <LoadingSkeleton /> : (
              <>
                <ScorePanel result={result} />
                {!isViewing && jdText.trim().length > 0 && result.jdMatch && (
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>JD match score</p>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: result.jdMatch.score >= 75 ? 'var(--color-success)' : result.jdMatch.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                        {result.jdMatch.score}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ marginBottom: 'var(--space-4)' }}>
                      <div className={`progress-fill ${result.jdMatch.score >= 75 ? 'success' : result.jdMatch.score >= 50 ? 'warning' : ''}`} style={{ width: `${result.jdMatch.score}%` }} />
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>Keywords present</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                      {result.jdMatch.present.map(k => <span key={k} className="badge keyword-pill-present">{k}</span>)}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>Missing keywords</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {result.jdMatch.missing.map(k => <span key={k} className="badge keyword-pill-missing">{k}</span>)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            {loading ? <LoadingSkeleton /> : <SuggestionsPanel suggestions={result?.suggestions || []} resumeId={resumeId} />}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {[200, 140, 100].map(h => (
        <div key={h} style={{ height: h, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      ))}
    </div>
  );
}
// // src/pages/ATSPage.jsx
// import { useState } from 'react'
// import { useNavigate } from 'react-router'
// import { useAuth } from '../context/AuthContext'
// import toast from 'react-hot-toast'
// import SourceToggle from '../components/ats/SourceToggle'
// import ScorePanel from '../components/ats/ScorePanel'
// import SuggestionsPanel from '../components/ats/SuggestionsPanel'
// import * as resumeService from '../services/resumeService'

// const ROLES = [
//   'Software Engineer', 'Frontend Developer', 'Backend Developer',
//   'Data Analyst', 'Data Scientist', 'Product Manager',
//   'UX Designer', 'DevOps Engineer', 'Full Stack Developer', 'Others'
// ]

// function authToast(message, icon = '🔒') {
//   toast(message, {
//     icon, position: 'top-center', duration: 1500,
//     style: { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }
//   })
// }

// function uploadToast() {
//   toast.error('Upload your resume first', { icon: '📄', position: 'top-center' })
// }

// export default function ATSPage() {
//   const { token } = useAuth()
//   const navigate = useNavigate()

//   const [source, setSource] = useState('upload')
//   const [file, setFile] = useState(null)
//   const [fileName, setFileName] = useState(null)
//   const [role, setRole] = useState('')
//   const [customRole, setCustomRole] = useState('')
//   const [jdText, setJdText] = useState('')
//   const [linkedInUrl, setLinkedInUrl] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState(null)
//   const [resumeId, setResumeId] = useState(null)

//   const activeRole = role === 'Others' ? customRole : role

//   function redirectToLogin() { navigate('/login', { replace: true }) }
//   function requireAuth() {
//     if (!token) { authToast('Log in to use this feature'); redirectToLogin(); return false }
//     return true
//   }

//   // File handling
//   function handleDrop(e) { e.preventDefault(); if (!requireAuth()) return; const f = e.dataTransfer.files[0]; if (f) processFile(f) }
//   function handleDragOver(e) { e.preventDefault() }
//   function handleDropzoneClick() { if (!requireAuth()) return; document.getElementById('resume-file-input').click() }
//   function handleFileInputChange(e) { const f = e.target.files[0]; if (f) processFile(f) }

//   function processFile(f) {
//     const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//     if (!allowed.includes(f.type)) {
//       toast.error('Only PDF or DOC/DOCX files allowed', { position: 'top-center' })
//       return
//     }
//     setFile(f)
//     setFileName(f.name)
//   }

//   function handleLinkedInUrlChange(val) { setLinkedInUrl(val) }
//   function handleLinkedInImport() { if (!requireAuth()) return; console.log('linkedin import:', linkedInUrl) }
//   function handleRoleChange(val) { if (!requireAuth()) return; setRole(val); setCustomRole('') }
//   function handleCustomRoleChange(val) { if (!requireAuth()) return; setCustomRole(val) }
//   function handleJdChange(val) { if (!requireAuth()) return; setJdText(val) }
//   function handleSourceChange(val) { if (!requireAuth()) return; setSource(val); setFile(null); setFileName(null) }

//   async function handleAnalyze() {
//     if (!requireAuth()) return
//     if (!file && source === 'upload') { uploadToast(); return }
//     if (!jdText) { toast.error('Paste or enter a job description'); return }

//     setLoading(true)
//     try {
//       const data = await resumeService.analyze({ file, jdText, token })
//       if (data.resume?._id) setResumeId(data.resume._id)

//       // Transform backend suggestions into the format expected by SuggestionsPanel
//       const rawSuggestions = data.analysis?.suggestions || []
//       const formattedSuggestions = rawSuggestions.map((text, idx) => ({
//         id: idx + 1,
//         section: 'General',          // optional, can be left generic
//         type: 'Improve',             // all suggestions are improvements (filters removed)
//         priority: 'Medium',
//         before: null,
//         after: text,
//       }))

//       setResult({
//         atsScore: data.analysis?.atsScore ?? 0,
//         jobRole: activeRole || 'General',
//         breakdown: data.analysis?.formatting?.score ? [{ label: 'Formatting score', value: data.analysis.formatting.score }] : [],
//         keywords: {
//           present: data.analysis?.keywords?.found || [],
//           missing: data.analysis?.keywords?.missing || [],
//         },
//         jdMatch: {
//           score: data.analysis?.atsScore ?? 0,
//           present: data.analysis?.keywords?.found || [],
//           missing: data.analysis?.keywords?.missing || [],
//         },
//         suggestions: formattedSuggestions,
//         summary: data.analysis?.summary || '',
//         strengths: data.analysis?.strengths || [],
//         weaknesses: data.analysis?.weaknesses || [],
//         improvementTips: data.analysis?.improvementTips || [],
//       })
//     } catch (err) {
//       toast.error(err.message || 'Analysis failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
//       <div style={{ marginBottom: 'var(--space-6)' }}>
//         <h2 style={{ marginBottom: 'var(--space-1)' }}>Check your ATS score</h2>
//         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
//           Upload your resume, add a job description, and get instant AI analysis
//         </p>
//       </div>

//       <div style={{ marginBottom: 'var(--space-5)' }}>
//         <SourceToggle active={source} onChange={handleSourceChange} />
//       </div>

//       {/* Upload zone */}
//       {source === 'upload' && (
//         <div style={{ marginBottom: 'var(--space-5)' }}>
//           <div className="dropzone" onClick={handleDropzoneClick} onDrop={handleDrop} onDragOver={handleDragOver}>
//             <input id="resume-file-input" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileInputChange} />
//             <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto var(--space-3)' }}>
//               <rect width="36" height="36" rx="10" fill="var(--color-primary-subtle)"/>
//               <path d="M18 24v-9M15 18l3-3 3 3" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 27h12" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
//             </svg>
//             {fileName ? (
//               <>
//                 <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-primary)' }}>{fileName}</p>
//                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Click to change file</p>
//               </>
//             ) : (
//               <>
//                 <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
//                   Drag &amp; drop your resume here
//                 </p>
//                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>PDF or DOC · max 5MB</p>
//                 <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); handleDropzoneClick() }}>Browse files</button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* LinkedIn import zone (simplified) */}
//       {source === 'linkedin' && (
//         <div style={{ marginBottom: 'var(--space-5)' }}>
//           <div style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', textAlign: 'center' }}>
//             <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-4)' }}>Paste your LinkedIn profile URL</p>
//             <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 480, margin: '0 auto' }}>
//               <input className="input" placeholder="https://linkedin.com/in/yourname" value={linkedInUrl} onChange={e => handleLinkedInUrlChange(e.target.value)} />
//               <button className="btn btn-primary btn-sm" onClick={handleLinkedInImport}>Import</button>
//             </div>
//             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>Or upload your LinkedIn PDF export below</p>
//             <div className="dropzone" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-5)' }} onClick={handleDropzoneClick} onDrop={handleDrop} onDragOver={handleDragOver}>
//               <input id="resume-file-input" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileInputChange} />
//               <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{fileName ? fileName : 'Drop LinkedIn PDF export here'}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Role + JD card */}
//       <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
//         <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
//           <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Target role</label>
//           <select value={role} onChange={e => handleRoleChange(e.target.value)} className="input" style={{ width: 220, height: 44, cursor: 'pointer' }}>
//             <option value="">Select a role</option>
//             {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
//           </select>
//           {role === 'Others' && <input className="input" style={{ width: 220 }} placeholder="Type your job role..." value={customRole} onChange={e => handleCustomRoleChange(e.target.value)} autoFocus />}
//         </div>
//         <div style={{ height: 1, background: 'var(--color-border-surface)', marginBottom: 'var(--space-5)' }} />
//         <div style={{ marginBottom: 'var(--space-5)' }}>
//           <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
//             Job description
//             <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-regular)', marginLeft: 'var(--space-2)' }}>optional — paste the JD to get a match score</span>
//           </label>
//           <textarea className="input textarea" rows={5} placeholder="Paste the full job description here..." value={jdText} onChange={e => handleJdChange(e.target.value)} />
//           {jdText.trim().length > 0 && <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>{jdText.trim().split(/\s+/).length} words · JD match will run automatically</p>}
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>{loading ? 'Analyzing…' : 'Analyze resume'}</button>
//         </div>
//       </div>

//       {/* Results */}
//       {(loading || result) && (
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
//             {loading ? <LoadingSkeleton /> : (
//               <>
//                 <ScorePanel result={result} />
//                 {jdText.trim().length > 0 && result.jdMatch && (
//                   <div className="card">
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
//                       <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>JD match score</p>
//                       <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: result.jdMatch.score >= 75 ? 'var(--color-success)' : result.jdMatch.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
//                         {result.jdMatch.score}%
//                       </span>
//                     </div>
//                     <div className="progress-track" style={{ marginBottom: 'var(--space-4)' }}>
//                       <div className={`progress-fill ${result.jdMatch.score >= 75 ? 'success' : result.jdMatch.score >= 50 ? 'warning' : ''}`} style={{ width: `${result.jdMatch.score}%` }} />
//                     </div>
//                     <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>Keywords present</p>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
//                       {result.jdMatch.present.map(k => <span key={k} className="badge keyword-pill-present">{k}</span>)}
//                     </div>
//                     <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>Missing keywords</p>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
//                       {result.jdMatch.missing.map(k => <span key={k} className="badge keyword-pill-missing">{k}</span>)}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//           <div>
//             {loading ? <LoadingSkeleton /> : <SuggestionsPanel suggestions={result?.suggestions || []} resumeId={resumeId} />}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function LoadingSkeleton() {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
//       {[200, 140, 100].map(h => (
//         <div key={h} style={{ height: h, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
//       ))}
//     </div>
//   )
// }
// // // // src/pages/ATSPage.jsx

// // // import { useState }         from 'react'
// // // import { useNavigate }      from 'react-router'
// // // import { useAuth }          from '../context/AuthContext'
// // // import toast                from 'react-hot-toast'
// // // import SourceToggle         from '../components/ats/SourceToggle'
// // // import ScorePanel           from '../components/ats/ScorePanel'
// // // import SuggestionsPanel     from '../components/ats/SuggestionsPanel'
// // // import * as resumeService   from '../services/resumeService'

// // // const MOCK_RESULT = {
// // //   atsScore: 78,
// // //   jobRole:  'Software Engineer',
// // //   breakdown: [
// // //     { label: 'Keyword match',        value: 82 },
// // //     { label: 'Section completeness', value: 90 },
// // //     { label: 'Formatting score',     value: 65 },
// // //   ],
// // //   keywords: {
// // //     present: ['React', 'Node.js', 'TypeScript', 'REST API'],
// // //     missing: ['Docker', 'Kubernetes', 'CI/CD'],
// // //   },
// // //   jdMatch: {
// // //     score:   74,
// // //     present: ['React', 'Node.js', 'REST API', 'TypeScript'],
// // //     missing: ['Docker', 'Kubernetes', 'GraphQL'],
// // //   },
// // //   suggestions: [
// // //     {
// // //       id: 1, section: 'Experience', type: 'Improve', priority: 'High',
// // //       before: 'Worked on various backend features',
// // //       after:  'Engineered 4 REST API features using Node.js, reducing response time by 35%',
// // //     },
// // //     {
// // //       id: 2, section: 'Skills', type: 'Add', priority: 'Medium',
// // //       before: null,
// // //       after:  'Add Docker, Kubernetes, CI/CD to your skills section',
// // //     },
// // //     {
// // //       id: 3, section: 'Summary', type: 'Improve', priority: 'Low',
// // //       before: 'Experienced developer looking for opportunities',
// // //       after:  'Full-stack engineer with 3 years building scalable web apps using React and Node.js',
// // //     },
// // //   ],
// // // }

// // // const ROLES = [
// // //   'Software Engineer',    'Frontend Developer',
// // //   'Backend Developer',    'Data Analyst',
// // //   'Data Scientist',       'Product Manager',
// // //   'UX Designer',          'DevOps Engineer',
// // //   'Full Stack Developer', 'Others',
// // // ]

// // // // centered toast helper — reusable across all actions
// // // function authToast(message, icon = '🔒') {
// // //   toast(message, {
// // //     icon,
// // //     position: 'top-center',
// // //     duration: 1500,
// // //     style: {
// // //       fontFamily:   'var(--font-body)',
// // //       fontSize:     'var(--text-sm)',
// // //       borderRadius: 'var(--radius-md)',
// // //       border:       '1px solid var(--color-primary-muted)',
// // //       color:        'var(--color-primary-dark)',
// // //       background:   'var(--color-primary-subtle)',
// // //       padding:      'var(--space-3) var(--space-5)',
// // //     },
// // //   })
// // // }

// // // function uploadToast() {
// // //   toast.error('Upload your resume first', {
// // //     icon: '📄',
// // //     position: 'top-center',
// // //     duration: 2000,
// // //     style: {
// // //       fontFamily:   'var(--font-body)',
// // //       fontSize:     'var(--text-sm)',
// // //       borderRadius: 'var(--radius-md)',
// // //       border:       '1px solid var(--color-border)',
// // //       color:        'var(--color-text-primary)',
// // //       background:   'var(--color-bg-surface)',
// // //       padding:      'var(--space-3) var(--space-5)',
// // //     },
// // //   })
// // // }

// // // export default function ATSPage() {
// // //   const { token } = useAuth()
// // //   const navigate  = useNavigate()

// // //   const [source,     setSource]     = useState('upload')
// // //   const [file,       setFile]       = useState(null)
// // //   const [fileName,   setFileName]   = useState(null)
// // //   const [role,       setRole]       = useState('')
// // //   const [customRole, setCustomRole] = useState('')
// // //   const [jdText,     setJdText]     = useState('')
// // //   const [linkedInUrl,setLinkedInUrl]= useState('')
// // //   const [loading,    setLoading]    = useState(false)
// // //   const [result,     setResult]     = useState(null)

// // //   const activeRole = role === 'Others' ? customRole : role

// // //   // redirect immediately — no delay
// // //   function redirectToLogin() {
// // //     navigate('/login', { replace: true })
// // //   }

// // //   function requireAuth() {
// // //     if (!token) {
// // //       authToast('Log in to use this feature')
// // //       redirectToLogin()
// // //       return false
// // //     }
// // //     return true
// // //   }

// // //   // ── Upload zone handlers ──────────────────────────────
// // //   function handleDrop(e) {
// // //     e.preventDefault()
// // //     if (!requireAuth()) return
// // //     const f = e.dataTransfer.files[0]
// // //     if (f) processFile(f)
// // //   }

// // //   function handleDragOver(e) {
// // //     e.preventDefault()
// // //   }

// // //   function handleDropzoneClick() {
// // //     if (!requireAuth()) return
// // //     document.getElementById('resume-file-input').click()
// // //   }

// // //   function handleFileInputChange(e) {
// // //     const f = e.target.files[0]
// // //     if (f) processFile(f)
// // //   }

// // //   function processFile(f) {
// // //     const allowed = [
// // //       'application/pdf',
// // //       'application/msword',
// // //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// // //     ]
// // //     if (!allowed.includes(f.type)) {
// // //       toast.error('Only PDF or DOC/DOCX files allowed', {
// // //         position: 'top-center',
// // //         style: {
// // //           fontFamily:   'var(--font-body)',
// // //           fontSize:     'var(--text-sm)',
// // //           borderRadius: 'var(--radius-md)',
// // //           background:   'var(--color-bg-surface)',
// // //           color:        'var(--color-text-primary)',
// // //           border:       '1px solid var(--color-border)',
// // //         },
// // //       })
// // //       return
// // //     }
// // //     setFile(f)
// // //     setFileName(f.name)
// // //   }

// // //   // ── LinkedIn import handlers ──────────────────────────
// // //   function handleLinkedInUrlChange(val) {
// // //     setLinkedInUrl(val)
// // //   }

// // //   function handleLinkedInImport() {
// // //     if (!requireAuth()) return
// // //     console.log('linkedin import:', linkedInUrl)
// // //     // swap with linkedInService.import(linkedInUrl) on Day 3
// // //   }

// // //   // ── Role / JD handlers ───────────────────────────────
// // //   function handleRoleChange(val) {
// // //     if (!requireAuth()) return
// // //     setRole(val)
// // //     setCustomRole('')
// // //   }

// // //   function handleCustomRoleChange(val) {
// // //     if (!requireAuth()) return
// // //     setCustomRole(val)
// // //   }

// // //   function handleJdChange(val) {
// // //     if (!requireAuth()) return
// // //     setJdText(val)
// // //   }

// // //   function handleSourceChange(val) {
// // //     if (!requireAuth()) return
// // //     setSource(val)
// // //     setFile(null)
// // //     setFileName(null)
// // //   }

// // //   // ── Analyze ──────────────────────────────────────────
// // //   async function handleAnalyze() {
// // //     if (!requireAuth()) return;
// // //     if (!file && source === 'upload') {
// // //       uploadToast();
// // //       return;
// // //     }
// // //     if (!jdText) {
// // //       toast.error('Paste or enter a job description', { position: 'top-center' });
// // //       return;
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       const data = await resumeService.analyze({ file, jdText, token });
// // //       // The backend returns { success, message, resume, analysis }
// // //       setResult({
// // //         atsScore: data.analysis?.atsScore ?? 0,
// // //         jobRole: activeRole || 'General',
// // //         breakdown: data.analysis?.formatting?.score
// // //           ? [
// // //               { label: 'Formatting score', value: data.analysis.formatting.score },
// // //             ]
// // //           : [],
// // //         keywords: {
// // //           present: data.analysis?.keywords?.found || [],
// // //           missing: data.analysis?.keywords?.missing || [],
// // //         },
// // //         jdMatch: {
// // //           score: data.analysis?.atsScore ?? 0,
// // //           present: data.analysis?.keywords?.found || [],
// // //           missing: data.analysis?.keywords?.missing || [],
// // //         },
// // //         suggestions: (data.analysis?.suggestions || []).map((s, i) => ({
// // //           id: i + 1,
// // //           section: '',
// // //           type: '',
// // //           priority: '',
// // //           before: null,
// // //           after: s,
// // //         })),
// // //         summary: data.analysis?.summary || '',
// // //         strengths: data.analysis?.strengths || [],
// // //         weaknesses: data.analysis?.weaknesses || [],
// // //         improvementTips: data.analysis?.improvementTips || [],
// // //       });
// // //     } catch (err) {
// // //       toast.error(err.message || 'Analysis failed', { position: 'top-center' });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   return (
// // //     <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>

// // //       {/* ── Page header ── */}
// // //       <div style={{ marginBottom: 'var(--space-6)' }}>
// // //         <h2 style={{ marginBottom: 'var(--space-1)' }}>
// // //           Check your ATS score
// // //         </h2>
// // //         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
// // //           Upload your resume, add a job description, and get instant AI analysis
// // //         </p>
// // //       </div>

// // //       {/* ── Source toggle ── */}
// // //       <div style={{ marginBottom: 'var(--space-5)' }}>
// // //         <SourceToggle active={source} onChange={handleSourceChange} />
// // //       </div>

// // //       {/* ── Upload zone (inline — no FileDropzone import) ── */}
// // //       {source === 'upload' && (
// // //         <div style={{ marginBottom: 'var(--space-5)' }}>
// // //           <div
// // //             className="dropzone"
// // //             onClick={handleDropzoneClick}
// // //             onDrop={handleDrop}
// // //             onDragOver={handleDragOver}
// // //           >
// // //             {/* hidden file input */}
// // //             <input
// // //               id="resume-file-input"
// // //               type="file"
// // //               accept=".pdf,.doc,.docx"
// // //               style={{ display: 'none' }}
// // //               onChange={handleFileInputChange}
// // //             />

// // //             <svg
// // //               width="36" height="36" viewBox="0 0 36 36" fill="none"
// // //               style={{ margin: '0 auto var(--space-3)' }}
// // //             >
// // //               <rect width="36" height="36" rx="10" fill="var(--color-primary-subtle)"/>
// // //               <path d="M18 24v-9M15 18l3-3 3 3"
// // //                 stroke="var(--color-primary)" strokeWidth="1.8"
// // //                 strokeLinecap="round" strokeLinejoin="round"/>
// // //               <path d="M12 27h12"
// // //                 stroke="var(--color-primary)" strokeWidth="1.5"
// // //                 strokeLinecap="round" opacity=".4"/>
// // //             </svg>

// // //             {fileName ? (
// // //               <>
// // //                 <p style={{
// // //                   fontSize:   'var(--text-sm)',
// // //                   fontWeight: 'var(--weight-medium)',
// // //                   color:      'var(--color-primary)',
// // //                   marginBottom:'var(--space-1)',
// // //                 }}>
// // //                   {fileName}
// // //                 </p>
// // //                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
// // //                   Click to change file
// // //                 </p>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <p style={{
// // //                   fontSize:    'var(--text-sm)',
// // //                   fontWeight:  'var(--weight-medium)',
// // //                   color:       'var(--color-text-primary)',
// // //                   marginBottom:'var(--space-1)',
// // //                 }}>
// // //                   Drag &amp; drop your resume here
// // //                 </p>
// // //                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
// // //                   PDF or DOC · max 5MB
// // //                 </p>
// // //                 <button
// // //                   className="btn btn-secondary btn-sm"
// // //                   onClick={e => { e.stopPropagation(); handleDropzoneClick() }}
// // //                 >
// // //                   Browse files
// // //                 </button>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ── LinkedIn import (inline — no LinkedInImport import) ── */}
// // //       {source === 'linkedin' && (
// // //         <div style={{ marginBottom: 'var(--space-5)' }}>
// // //           <div style={{
// // //             background:   'var(--color-bg-surface-2)',
// // //             border:       '1px solid var(--color-border)',
// // //             borderRadius: 'var(--radius-xl)',
// // //             padding:      'var(--space-8)',
// // //             textAlign:    'center',
// // //           }}>
// // //             <p style={{
// // //               fontSize:     'var(--text-sm)',
// // //               fontWeight:   'var(--weight-medium)',
// // //               color:        'var(--color-text-primary)',
// // //               marginBottom: 'var(--space-4)',
// // //             }}>
// // //               Paste your LinkedIn profile URL
// // //             </p>

// // //             <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 480, margin: '0 auto' }}>
// // //               <input
// // //                 className="input"
// // //                 placeholder="https://linkedin.com/in/yourname"
// // //                 value={linkedInUrl}
// // //                 onChange={e => handleLinkedInUrlChange(e.target.value)}
// // //               />
// // //               <button
// // //                 className="btn btn-primary btn-sm"
// // //                 onClick={handleLinkedInImport}
// // //               >
// // //                 Import
// // //               </button>
// // //             </div>

// // //             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
// // //               Or upload your LinkedIn PDF export below
// // //             </p>

// // //             {/* LinkedIn PDF upload — auth guarded via handleDropzoneClick */}
// // //             <div
// // //               className="dropzone"
// // //               style={{ marginTop: 'var(--space-4)', padding: 'var(--space-5)' }}
// // //               onClick={handleDropzoneClick}
// // //               onDrop={handleDrop}
// // //               onDragOver={handleDragOver}
// // //             >
// // //               <input
// // //                 id="resume-file-input"
// // //                 type="file"
// // //                 accept=".pdf,.doc,.docx"
// // //                 style={{ display: 'none' }}
// // //                 onChange={handleFileInputChange}
// // //               />
// // //               <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
// // //                 {fileName ? fileName : 'Drop LinkedIn PDF export here'}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ── Role + JD card ── */}
// // //       <div className="card" style={{ marginBottom: 'var(--space-8)' }}>

// // //         {/* Target role row */}
// // //         <div style={{
// // //           display:      'flex',
// // //           alignItems:   'center',
// // //           flexWrap:     'wrap',
// // //           gap:          'var(--space-3)',
// // //           marginBottom: 'var(--space-5)',
// // //         }}>
// // //           <label style={{
// // //             fontSize:   'var(--text-sm)',
// // //             fontWeight: 'var(--weight-medium)',
// // //             color:      'var(--color-text-secondary)',
// // //             whiteSpace: 'nowrap',
// // //           }}>
// // //             Target role
// // //           </label>

// // //           <select
// // //             value={role}
// // //             onChange={e => handleRoleChange(e.target.value)}
// // //             className="input"
// // //             style={{ width: 220, height: 44, cursor: 'pointer' }}
// // //           >
// // //             <option value="">Select a role</option>
// // //             {ROLES.map(r => (
// // //               <option key={r} value={r}>{r}</option>
// // //             ))}
// // //           </select>

// // //           {role === 'Others' && (
// // //             <input
// // //               className="input"
// // //               style={{ width: 220 }}
// // //               placeholder="Type your job role..."
// // //               value={customRole}
// // //               onChange={e => handleCustomRoleChange(e.target.value)}
// // //               autoFocus
// // //             />
// // //           )}
// // //         </div>

// // //         {/* Divider */}
// // //         <div style={{
// // //           height:       1,
// // //           background:   'var(--color-border-surface)',
// // //           marginBottom: 'var(--space-5)',
// // //         }} />

// // //         {/* Job description */}
// // //         <div style={{ marginBottom: 'var(--space-5)' }}>
// // //           <label style={{
// // //             display:      'block',
// // //             fontSize:     'var(--text-sm)',
// // //             fontWeight:   'var(--weight-medium)',
// // //             color:        'var(--color-text-secondary)',
// // //             marginBottom: 'var(--space-2)',
// // //           }}>
// // //             Job description
// // //             <span
// // //               className="text-tertiary"
// // //               style={{
// // //                 fontSize:   'var(--text-xs)',
// // //                 fontWeight: 'var(--weight-regular)',
// // //                 marginLeft: 'var(--space-2)',
// // //               }}
// // //             >
// // //               optional — paste the JD to get a match score
// // //             </span>
// // //           </label>

// // //           <textarea
// // //             className="input textarea"
// // //             rows={5}
// // //             placeholder="Paste the full job description here. We'll compare it against your resume and show you exactly which keywords you're missing..."
// // //             value={jdText}
// // //             onChange={e => handleJdChange(e.target.value)}
// // //           />

// // //           {jdText.trim().length > 0 && (
// // //             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
// // //               {jdText.trim().split(/\s+/).length} words · JD match will run automatically
// // //             </p>
// // //           )}
// // //         </div>

// // //         {/* Analyze button */}
// // //         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
// // //           <button
// // //             className="btn btn-primary"
// // //             onClick={handleAnalyze}
// // //             disabled={loading}
// // //           >
// // //             {loading ? 'Analyzing…' : 'Analyze resume'}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ── Results ── */}
// // //       {(loading || result) && (
// // //         <div style={{
// // //           display:             'grid',
// // //           gridTemplateColumns: '1fr 1fr',
// // //           gap:                 'var(--space-6)',
// // //           alignItems:          'start',
// // //         }}>

// // //           {/* LEFT — score + JD match */}
// // //           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
// // //             {loading ? <LoadingSkeleton /> : (
// // //               <>
// // //                 <ScorePanel result={result} />

// // //                 {jdText.trim().length > 0 && result.jdMatch && (
// // //                   <div className="card">

// // //                     <div style={{
// // //                       display:        'flex',
// // //                       alignItems:     'center',
// // //                       justifyContent: 'space-between',
// // //                       marginBottom:   'var(--space-4)',
// // //                     }}>
// // //                       <p style={{
// // //                         fontSize:   'var(--text-sm)',
// // //                         fontWeight: 'var(--weight-medium)',
// // //                         color:      'var(--color-text-primary)',
// // //                       }}>
// // //                         JD match score
// // //                       </p>
// // //                       <span style={{
// // //                         fontFamily: 'var(--font-display)',
// // //                         fontSize:   'var(--text-xl)',
// // //                         fontWeight: 'var(--weight-bold)',
// // //                         color:      result.jdMatch.score >= 75
// // //                           ? 'var(--color-success)'
// // //                           : result.jdMatch.score >= 50
// // //                           ? 'var(--color-warning)'
// // //                           : 'var(--color-danger)',
// // //                       }}>
// // //                         {result.jdMatch.score}%
// // //                       </span>
// // //                     </div>

// // //                     <div className="progress-track" style={{ marginBottom: 'var(--space-4)' }}>
// // //                       <div
// // //                         className={`progress-fill ${
// // //                           result.jdMatch.score >= 75 ? 'success' :
// // //                           result.jdMatch.score >= 50 ? 'warning' : ''
// // //                         }`}
// // //                         style={{ width: `${result.jdMatch.score}%` }}
// // //                       />
// // //                     </div>

// // //                     <p style={{
// // //                       fontSize:     'var(--text-xs)',
// // //                       fontWeight:   'var(--weight-medium)',
// // //                       color:        'var(--color-text-primary)',
// // //                       marginBottom: 'var(--space-2)',
// // //                     }}>
// // //                       Keywords present
// // //                     </p>
// // //                     <div style={{
// // //                       display:      'flex',
// // //                       flexWrap:     'wrap',
// // //                       gap:          'var(--space-2)',
// // //                       marginBottom: 'var(--space-4)',
// // //                     }}>
// // //                       {result.jdMatch.present.map(k => (
// // //                         <span key={k} className="badge keyword-pill-present">{k}</span>
// // //                       ))}
// // //                     </div>

// // //                     <p style={{
// // //                       fontSize:     'var(--text-xs)',
// // //                       fontWeight:   'var(--weight-medium)',
// // //                       color:        'var(--color-text-primary)',
// // //                       marginBottom: 'var(--space-2)',
// // //                     }}>
// // //                       Missing keywords
// // //                     </p>
// // //                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
// // //                       {result.jdMatch.missing.map(k => (
// // //                         <span key={k} className="badge keyword-pill-missing">{k}</span>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </>
// // //             )}
// // //           </div>

// // //           {/* RIGHT — suggestions */}
// // //           <div>
// // //             {loading
// // //               ? <LoadingSkeleton />
// // //               : <SuggestionsPanel suggestions={result.suggestions} />
// // //             }
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // // function LoadingSkeleton() {
// // //   return (
// // //     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
// // //       {[200, 140, 100].map(h => (
// // //         <div key={h} style={{
// // //           height:         h,
// // //           borderRadius:   'var(--radius-lg)',
// // //           background:     'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
// // //           backgroundSize: '200% 100%',
// // //           animation:      'shimmer 1.4s infinite',
// // //         }} />
// // //       ))}
// // //     </div>
// // //   )
// // // }



// // // src/pages/ATSPage.jsx

// // import { useState }         from 'react'
// // import { useNavigate }      from 'react-router'
// // import { useAuth }          from '../context/AuthContext'
// // import toast                from 'react-hot-toast'
// // import SourceToggle         from '../components/ats/SourceToggle'
// // import ScorePanel           from '../components/ats/ScorePanel'
// // import SuggestionsPanel     from '../components/ats/SuggestionsPanel'
// // import * as resumeService   from '../services/resumeService'

// // const MOCK_RESULT = {
// //   atsScore: 78,
// //   jobRole:  'Software Engineer',
// //   breakdown: [
// //     { label: 'Keyword match',        value: 82 },
// //     { label: 'Section completeness', value: 90 },
// //     { label: 'Formatting score',     value: 65 },
// //   ],
// //   keywords: {
// //     present: ['React', 'Node.js', 'TypeScript', 'REST API'],
// //     missing: ['Docker', 'Kubernetes', 'CI/CD'],
// //   },
// //   jdMatch: {
// //     score:   74,
// //     present: ['React', 'Node.js', 'REST API', 'TypeScript'],
// //     missing: ['Docker', 'Kubernetes', 'GraphQL'],
// //   },
// //   suggestions: [
// //     {
// //       id: 1, section: 'Experience', type: 'Improve', priority: 'High',
// //       before: 'Worked on various backend features',
// //       after:  'Engineered 4 REST API features using Node.js, reducing response time by 35%',
// //     },
// //     {
// //       id: 2, section: 'Skills', type: 'Add', priority: 'Medium',
// //       before: null,
// //       after:  'Add Docker, Kubernetes, CI/CD to your skills section',
// //     },
// //     {
// //       id: 3, section: 'Summary', type: 'Improve', priority: 'Low',
// //       before: 'Experienced developer looking for opportunities',
// //       after:  'Full-stack engineer with 3 years building scalable web apps using React and Node.js',
// //     },
// //   ],
// // }

// // const ROLES = [
// //   'Software Engineer',    'Frontend Developer',
// //   'Backend Developer',    'Data Analyst',
// //   'Data Scientist',       'Product Manager',
// //   'UX Designer',          'DevOps Engineer',
// //   'Full Stack Developer', 'Others',
// // ]

// // // centered toast helper — reusable across all actions
// // function authToast(message, icon = '🔒') {
// //   toast(message, {
// //     icon,
// //     position: 'top-center',
// //     duration: 1500,
// //     style: {
// //       fontFamily:   'var(--font-body)',
// //       fontSize:     'var(--text-sm)',
// //       borderRadius: 'var(--radius-md)',
// //       border:       '1px solid var(--color-primary-muted)',
// //       color:        'var(--color-primary-dark)',
// //       background:   'var(--color-primary-subtle)',
// //       padding:      'var(--space-3) var(--space-5)',
// //     },
// //   })
// // }

// // function uploadToast() {
// //   toast.error('Upload your resume first', {
// //     icon: '📄',
// //     position: 'top-center',
// //     duration: 2000,
// //     style: {
// //       fontFamily:   'var(--font-body)',
// //       fontSize:     'var(--text-sm)',
// //       borderRadius: 'var(--radius-md)',
// //       border:       '1px solid var(--color-border)',
// //       color:        'var(--color-text-primary)',
// //       background:   'var(--color-bg-surface)',
// //       padding:      'var(--space-3) var(--space-5)',
// //     },
// //   })
// // }

// // export default function ATSPage() {
// //   const { token } = useAuth()
// //   const navigate  = useNavigate()

// //   const [source,     setSource]     = useState('upload')
// //   const [file,       setFile]       = useState(null)
// //   const [fileName,   setFileName]   = useState(null)
// //   const [role,       setRole]       = useState('')
// //   const [customRole, setCustomRole] = useState('')
// //   const [jdText,     setJdText]     = useState('')
// //   const [linkedInUrl,setLinkedInUrl]= useState('')
// //   const [loading,    setLoading]    = useState(false)
// //   const [result,     setResult]     = useState(null)
// //   const [resumeId,   setResumeId]   = useState(null)   // <-- NEW: store resume ID

// //   const activeRole = role === 'Others' ? customRole : role

// //   // redirect immediately — no delay
// //   function redirectToLogin() {
// //     navigate('/login', { replace: true })
// //   }

// //   function requireAuth() {
// //     if (!token) {
// //       authToast('Log in to use this feature')
// //       redirectToLogin()
// //       return false
// //     }
// //     return true
// //   }

// //   // ── Upload zone handlers ──────────────────────────────
// //   function handleDrop(e) {
// //     e.preventDefault()
// //     if (!requireAuth()) return
// //     const f = e.dataTransfer.files[0]
// //     if (f) processFile(f)
// //   }

// //   function handleDragOver(e) {
// //     e.preventDefault()
// //   }

// //   function handleDropzoneClick() {
// //     if (!requireAuth()) return
// //     document.getElementById('resume-file-input').click()
// //   }

// //   function handleFileInputChange(e) {
// //     const f = e.target.files[0]
// //     if (f) processFile(f)
// //   }

// //   function processFile(f) {
// //     const allowed = [
// //       'application/pdf',
// //       'application/msword',
// //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// //     ]
// //     if (!allowed.includes(f.type)) {
// //       toast.error('Only PDF or DOC/DOCX files allowed', {
// //         position: 'top-center',
// //         style: {
// //           fontFamily:   'var(--font-body)',
// //           fontSize:     'var(--text-sm)',
// //           borderRadius: 'var(--radius-md)',
// //           background:   'var(--color-bg-surface)',
// //           color:        'var(--color-text-primary)',
// //           border:       '1px solid var(--color-border)',
// //         },
// //       })
// //       return
// //     }
// //     setFile(f)
// //     setFileName(f.name)
// //   }

// //   // ── LinkedIn import handlers ──────────────────────────
// //   function handleLinkedInUrlChange(val) {
// //     setLinkedInUrl(val)
// //   }

// //   function handleLinkedInImport() {
// //     if (!requireAuth()) return
// //     console.log('linkedin import:', linkedInUrl)
// //     // swap with linkedInService.import(linkedInUrl) on Day 3
// //   }

// //   // ── Role / JD handlers ───────────────────────────────
// //   function handleRoleChange(val) {
// //     if (!requireAuth()) return
// //     setRole(val)
// //     setCustomRole('')
// //   }

// //   function handleCustomRoleChange(val) {
// //     if (!requireAuth()) return
// //     setCustomRole(val)
// //   }

// //   function handleJdChange(val) {
// //     if (!requireAuth()) return
// //     setJdText(val)
// //   }

// //   function handleSourceChange(val) {
// //     if (!requireAuth()) return
// //     setSource(val)
// //     setFile(null)
// //     setFileName(null)
// //   }

// //   // ── Analyze ──────────────────────────────────────────
// //   async function handleAnalyze() {
// //     if (!requireAuth()) return;
// //     if (!file && source === 'upload') {
// //       uploadToast();
// //       return;
// //     }
// //     if (!jdText) {
// //       toast.error('Paste or enter a job description', { position: 'top-center' });
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       const data = await resumeService.analyze({ file, jdText, token });
// //       // Store the resume ID from the backend response
// //       if (data.resume?._id) {
// //         setResumeId(data.resume._id);
// //       } else {
// //         console.warn('No resume ID returned from analysis');
// //       }
// //       // Transform backend data to the format expected by the UI
// //       setResult({
// //         atsScore: data.analysis?.atsScore ?? 0,
// //         jobRole: activeRole || 'General',
// //         breakdown: data.analysis?.formatting?.score
// //           ? [
// //               { label: 'Formatting score', value: data.analysis.formatting.score },
// //             ]
// //           : [],
// //         keywords: {
// //           present: data.analysis?.keywords?.found || [],
// //           missing: data.analysis?.keywords?.missing || [],
// //         },
// //         jdMatch: {
// //           score: data.analysis?.atsScore ?? 0,
// //           present: data.analysis?.keywords?.found || [],
// //           missing: data.analysis?.keywords?.missing || [],
// //         },
// //         suggestions: (data.analysis?.suggestions || []).map((s, i) => ({
// //           id: i + 1,
// //           section: '',
// //           type: '',
// //           priority: '',
// //           before: null,
// //           after: s,   // the suggestion text
// //         })),
// //         summary: data.analysis?.summary || '',
// //         strengths: data.analysis?.strengths || [],
// //         weaknesses: data.analysis?.weaknesses || [],
// //         improvementTips: data.analysis?.improvementTips || [],
// //       });
// //     } catch (err) {
// //       toast.error(err.message || 'Analysis failed', { position: 'top-center' });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>

// //       {/* ── Page header ── */}
// //       <div style={{ marginBottom: 'var(--space-6)' }}>
// //         <h2 style={{ marginBottom: 'var(--space-1)' }}>
// //           Check your ATS score
// //         </h2>
// //         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
// //           Upload your resume, add a job description, and get instant AI analysis
// //         </p>
// //       </div>

// //       {/* ── Source toggle ── */}
// //       <div style={{ marginBottom: 'var(--space-5)' }}>
// //         <SourceToggle active={source} onChange={handleSourceChange} />
// //       </div>

// //       {/* ── Upload zone (inline — no FileDropzone import) ── */}
// //       {source === 'upload' && (
// //         <div style={{ marginBottom: 'var(--space-5)' }}>
// //           <div
// //             className="dropzone"
// //             onClick={handleDropzoneClick}
// //             onDrop={handleDrop}
// //             onDragOver={handleDragOver}
// //           >
// //             {/* hidden file input */}
// //             <input
// //               id="resume-file-input"
// //               type="file"
// //               accept=".pdf,.doc,.docx"
// //               style={{ display: 'none' }}
// //               onChange={handleFileInputChange}
// //             />

// //             <svg
// //               width="36" height="36" viewBox="0 0 36 36" fill="none"
// //               style={{ margin: '0 auto var(--space-3)' }}
// //             >
// //               <rect width="36" height="36" rx="10" fill="var(--color-primary-subtle)"/>
// //               <path d="M18 24v-9M15 18l3-3 3 3"
// //                 stroke="var(--color-primary)" strokeWidth="1.8"
// //                 strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 27h12"
// //                 stroke="var(--color-primary)" strokeWidth="1.5"
// //                 strokeLinecap="round" opacity=".4"/>
// //             </svg>

// //             {fileName ? (
// //               <>
// //                 <p style={{
// //                   fontSize:   'var(--text-sm)',
// //                   fontWeight: 'var(--weight-medium)',
// //                   color:      'var(--color-primary)',
// //                   marginBottom:'var(--space-1)',
// //                 }}>
// //                   {fileName}
// //                 </p>
// //                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
// //                   Click to change file
// //                 </p>
// //               </>
// //             ) : (
// //               <>
// //                 <p style={{
// //                   fontSize:    'var(--text-sm)',
// //                   fontWeight:  'var(--weight-medium)',
// //                   color:       'var(--color-text-primary)',
// //                   marginBottom:'var(--space-1)',
// //                 }}>
// //                   Drag &amp; drop your resume here
// //                 </p>
// //                 <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
// //                   PDF or DOC · max 5MB
// //                 </p>
// //                 <button
// //                   className="btn btn-secondary btn-sm"
// //                   onClick={e => { e.stopPropagation(); handleDropzoneClick() }}
// //                 >
// //                   Browse files
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* ── LinkedIn import (inline — no LinkedInImport import) ── */}
// //       {source === 'linkedin' && (
// //         <div style={{ marginBottom: 'var(--space-5)' }}>
// //           <div style={{
// //             background:   'var(--color-bg-surface-2)',
// //             border:       '1px solid var(--color-border)',
// //             borderRadius: 'var(--radius-xl)',
// //             padding:      'var(--space-8)',
// //             textAlign:    'center',
// //           }}>
// //             <p style={{
// //               fontSize:     'var(--text-sm)',
// //               fontWeight:   'var(--weight-medium)',
// //               color:        'var(--color-text-primary)',
// //               marginBottom: 'var(--space-4)',
// //             }}>
// //               Paste your LinkedIn profile URL
// //             </p>

// //             <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 480, margin: '0 auto' }}>
// //               <input
// //                 className="input"
// //                 placeholder="https://linkedin.com/in/yourname"
// //                 value={linkedInUrl}
// //                 onChange={e => handleLinkedInUrlChange(e.target.value)}
// //               />
// //               <button
// //                 className="btn btn-primary btn-sm"
// //                 onClick={handleLinkedInImport}
// //               >
// //                 Import
// //               </button>
// //             </div>

// //             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
// //               Or upload your LinkedIn PDF export below
// //             </p>

// //             {/* LinkedIn PDF upload — auth guarded via handleDropzoneClick */}
// //             <div
// //               className="dropzone"
// //               style={{ marginTop: 'var(--space-4)', padding: 'var(--space-5)' }}
// //               onClick={handleDropzoneClick}
// //               onDrop={handleDrop}
// //               onDragOver={handleDragOver}
// //             >
// //               <input
// //                 id="resume-file-input"
// //                 type="file"
// //                 accept=".pdf,.doc,.docx"
// //                 style={{ display: 'none' }}
// //                 onChange={handleFileInputChange}
// //               />
// //               <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
// //                 {fileName ? fileName : 'Drop LinkedIn PDF export here'}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Role + JD card ── */}
// //       <div className="card" style={{ marginBottom: 'var(--space-8)' }}>

// //         {/* Target role row */}
// //         <div style={{
// //           display:      'flex',
// //           alignItems:   'center',
// //           flexWrap:     'wrap',
// //           gap:          'var(--space-3)',
// //           marginBottom: 'var(--space-5)',
// //         }}>
// //           <label style={{
// //             fontSize:   'var(--text-sm)',
// //             fontWeight: 'var(--weight-medium)',
// //             color:      'var(--color-text-secondary)',
// //             whiteSpace: 'nowrap',
// //           }}>
// //             Target role
// //           </label>

// //           <select
// //             value={role}
// //             onChange={e => handleRoleChange(e.target.value)}
// //             className="input"
// //             style={{ width: 220, height: 44, cursor: 'pointer' }}
// //           >
// //             <option value="">Select a role</option>
// //             {ROLES.map(r => (
// //               <option key={r} value={r}>{r}</option>
// //             ))}
// //           </select>

// //           {role === 'Others' && (
// //             <input
// //               className="input"
// //               style={{ width: 220 }}
// //               placeholder="Type your job role..."
// //               value={customRole}
// //               onChange={e => handleCustomRoleChange(e.target.value)}
// //               autoFocus
// //             />
// //           )}
// //         </div>

// //         {/* Divider */}
// //         <div style={{
// //           height:       1,
// //           background:   'var(--color-border-surface)',
// //           marginBottom: 'var(--space-5)',
// //         }} />

// //         {/* Job description */}
// //         <div style={{ marginBottom: 'var(--space-5)' }}>
// //           <label style={{
// //             display:      'block',
// //             fontSize:     'var(--text-sm)',
// //             fontWeight:   'var(--weight-medium)',
// //             color:        'var(--color-text-secondary)',
// //             marginBottom: 'var(--space-2)',
// //           }}>
// //             Job description
// //             <span
// //               className="text-tertiary"
// //               style={{
// //                 fontSize:   'var(--text-xs)',
// //                 fontWeight: 'var(--weight-regular)',
// //                 marginLeft: 'var(--space-2)',
// //               }}
// //             >
// //               optional — paste the JD to get a match score
// //             </span>
// //           </label>

// //           <textarea
// //             className="input textarea"
// //             rows={5}
// //             placeholder="Paste the full job description here. We'll compare it against your resume and show you exactly which keywords you're missing..."
// //             value={jdText}
// //             onChange={e => handleJdChange(e.target.value)}
// //           />

// //           {jdText.trim().length > 0 && (
// //             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
// //               {jdText.trim().split(/\s+/).length} words · JD match will run automatically
// //             </p>
// //           )}
// //         </div>

// //         {/* Analyze button */}
// //         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
// //           <button
// //             className="btn btn-primary"
// //             onClick={handleAnalyze}
// //             disabled={loading}
// //           >
// //             {loading ? 'Analyzing…' : 'Analyze resume'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Results ── */}
// //       {(loading || result) && (
// //         <div style={{
// //           display:             'grid',
// //           gridTemplateColumns: '1fr 1fr',
// //           gap:                 'var(--space-6)',
// //           alignItems:          'start',
// //         }}>

// //           {/* LEFT — score + JD match */}
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
// //             {loading ? <LoadingSkeleton /> : (
// //               <>
// //                 <ScorePanel result={result} />

// //                 {jdText.trim().length > 0 && result.jdMatch && (
// //                   <div className="card">

// //                     <div style={{
// //                       display:        'flex',
// //                       alignItems:     'center',
// //                       justifyContent: 'space-between',
// //                       marginBottom:   'var(--space-4)',
// //                     }}>
// //                       <p style={{
// //                         fontSize:   'var(--text-sm)',
// //                         fontWeight: 'var(--weight-medium)',
// //                         color:      'var(--color-text-primary)',
// //                       }}>
// //                         JD match score
// //                       </p>
// //                       <span style={{
// //                         fontFamily: 'var(--font-display)',
// //                         fontSize:   'var(--text-xl)',
// //                         fontWeight: 'var(--weight-bold)',
// //                         color:      result.jdMatch.score >= 75
// //                           ? 'var(--color-success)'
// //                           : result.jdMatch.score >= 50
// //                           ? 'var(--color-warning)'
// //                           : 'var(--color-danger)',
// //                       }}>
// //                         {result.jdMatch.score}%
// //                       </span>
// //                     </div>

// //                     <div className="progress-track" style={{ marginBottom: 'var(--space-4)' }}>
// //                       <div
// //                         className={`progress-fill ${
// //                           result.jdMatch.score >= 75 ? 'success' :
// //                           result.jdMatch.score >= 50 ? 'warning' : ''
// //                         }`}
// //                         style={{ width: `${result.jdMatch.score}%` }}
// //                       />
// //                     </div>

// //                     <p style={{
// //                       fontSize:     'var(--text-xs)',
// //                       fontWeight:   'var(--weight-medium)',
// //                       color:        'var(--color-text-primary)',
// //                       marginBottom: 'var(--space-2)',
// //                     }}>
// //                       Keywords present
// //                     </p>
// //                     <div style={{
// //                       display:      'flex',
// //                       flexWrap:     'wrap',
// //                       gap:          'var(--space-2)',
// //                       marginBottom: 'var(--space-4)',
// //                     }}>
// //                       {result.jdMatch.present.map(k => (
// //                         <span key={k} className="badge keyword-pill-present">{k}</span>
// //                       ))}
// //                     </div>

// //                     <p style={{
// //                       fontSize:     'var(--text-xs)',
// //                       fontWeight:   'var(--weight-medium)',
// //                       color:        'var(--color-text-primary)',
// //                       marginBottom: 'var(--space-2)',
// //                     }}>
// //                       Missing keywords
// //                     </p>
// //                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
// //                       {result.jdMatch.missing.map(k => (
// //                         <span key={k} className="badge keyword-pill-missing">{k}</span>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </div>

// //           {/* RIGHT — suggestions */}
// //           <div>
// //             {loading
// //               ? <LoadingSkeleton />
// //               : <SuggestionsPanel suggestions={result.suggestions} resumeId={resumeId} />
// //             }
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // function LoadingSkeleton() {
// //   return (
// //     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
// //       {[200, 140, 100].map(h => (
// //         <div key={h} style={{
// //           height:         h,
// //           borderRadius:   'var(--radius-lg)',
// //           background:     'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
// //           backgroundSize: '200% 100%',
// //           animation:      'shimmer 1.4s infinite',
// //         }} />
// //       ))}
// //     </div>
// //   )
// // }