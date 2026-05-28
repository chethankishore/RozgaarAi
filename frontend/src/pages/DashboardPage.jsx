// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { formatDate } from '../utils/formatDate';
import { scoreColor } from '../utils/scoreColor';

export default function DashboardPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    avgAtsScore: 0,
    interviewSessions: 0,
    skillGaps: 0,
  });
  const [recentResumes, setRecentResumes] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/history');
      const historyData = response.data.data || [];

      // Map correctly: use the actual resume ID, not history ID
      const resumes = historyData.map(item => ({
        id: item.resumeId?._id,           // <-- resume ID for navigation
        historyId: item._id,
        fileName: item.resumeId?.fileName || 'Resume',
        createdAt: item.createdAt,
        atsScore: item.resumeId?.atsScore || 0,
      }));
      setRecentResumes(resumes);

      const total = resumes.length;
      const sum = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
      const avg = total > 0 ? Math.round(sum / total) : 0;
      setStats({
        totalAnalyses: total,
        avgAtsScore: avg,
        interviewSessions: 0,
        skillGaps: 0,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setRecentResumes([]);
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => navigate('/ats');
  const handleInterviewPrep = () => navigate('/interview');
  const handleViewAllResumes = () => navigate('/history');

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Skeleton height="120px" />
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
          Welcome back 👋
        </h1>
        <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
          Track your ATS performance and resume improvements
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <StatCard label="Total analyses" value={stats.totalAnalyses} icon="📄" color="var(--color-primary)" />
        <StatCard label="Average ATS score" value={`${stats.avgAtsScore}%`} icon="🎯" color={scoreColor(stats.avgAtsScore)} />
        <StatCard label="Interview sessions" value={stats.interviewSessions} icon="🎤" color="var(--color-info)" />
        <StatCard label="Skill gaps identified" value={stats.skillGaps} icon="📊" color="var(--color-warning)" />
      </div>

      {/* Recent resumes + quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>Recent analyses</h3>
            <button className="btn btn-ghost btn-sm" onClick={handleViewAllResumes}>View all →</button>
          </div>
          {recentResumes.length === 0 ? (
            <p className="text-tertiary" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              No resumes analyzed yet. <button className="btn-link" onClick={handleNewAnalysis}>Upload your first resume</button>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {recentResumes.map(resume => (
                <div key={resume.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-bg-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-surface)',
                }}>
                  <div>
                    <p style={{ fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-1)' }}>{resume.fileName}</p>
                    <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{formatDate(resume.createdAt)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontWeight: 'var(--weight-bold)', color: scoreColor(resume.atsScore) }}>{resume.atsScore}%</span>
                    {/* ✅ Now uses the actual resume ID */}
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/ats?resumeId=${resume.id}`)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>Quick actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary" onClick={handleNewAnalysis}>+ New ATS analysis</button>
            <button className="btn btn-secondary" onClick={handleInterviewPrep}>🎤 Start interview prep</button>
            <button className="btn btn-ghost" onClick={() => navigate('/linkedin-import')}>Import from LinkedIn</button>
          </div>
          <hr style={{ margin: 'var(--space-4) 0)', borderColor: 'var(--color-border-surface)' }} />
          <div>
            <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>💡 Pro tip</p>
            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              Upload a resume with a targeted job description to get the most accurate ATS score and keyword suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color, marginBottom: 'var(--space-1)' }}>{value}</p>
      <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{label}</p>
    </div>
  );
}

function Skeleton({ height }) {
  return (
    <div style={{
      height,
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}
// // // src/pages/DashboardPage.jsx
// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router'
// // import { useAuth } from '../context/AuthContext'
// // import toast from 'react-hot-toast'
// // import api from '../lib/axios'
// // import { formatDate } from '../utils/formatDate'
// // import { scoreColor } from '../utils/scoreColor'

// // export default function DashboardPage() {
// //   const { token } = useAuth()
// //   const navigate = useNavigate()
// //   const [loading, setLoading] = useState(true)
// //   const [stats, setStats] = useState({
// //     totalAnalyses: 0,
// //     avgAtsScore: 0,
// //     interviewSessions: 0,
// //     skillGaps: 0,
// //   })
// //   const [recentResumes, setRecentResumes] = useState([])

// //   useEffect(() => {
// //     if (!token) {
// //       navigate('/login')
// //       return
// //     }
// //     fetchDashboardData()
// //   }, [token])

// //   const fetchDashboardData = async () => {
// //   setLoading(true);
// //   try {
// //     // Use the correct endpoint (no "/resumes" suffix)
// //     const response = await api.get('/history');
// //     const historyData = response.data.data || [];

// //     // Map history entries to the format expected by the component
// //     const resumes = historyData.map(item => ({
// //       id: item._id,
// //       fileName: item.resumeId?.fileName || 'Resume',
// //       createdAt: item.createdAt,
// //       atsScore: item.resumeId?.atsScore || 0,
// //     }));
// //     setRecentResumes(resumes);

// //     // Calculate stats
// //     const total = resumes.length;
// //     const sum = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
// //     const avg = total > 0 ? Math.round(sum / total) : 0;
// //     setStats({
// //       totalAnalyses: total,
// //       avgAtsScore: avg,
// //       interviewSessions: 0,   // You can later fetch from InterviewSession model
// //       skillGaps: 0,
// //     });
// //   } catch (err) {
// //     console.error('Dashboard fetch error:', err);
// //     loadMockData();
// //     toast.error('Could not load dashboard data – showing demo stats');
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   const calculateStats = (resumes) => {
// //     if (!resumes || resumes.length === 0) return
// //     const total = resumes.length
// //     const sumAts = resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0)
// //     const avg = total > 0 ? Math.round(sumAts / total) : 0
// //     setStats(prev => ({
// //       ...prev,
// //       totalAnalyses: total,
// //       avgAtsScore: avg,
// //     }))
// //   }

// //   const loadMockData = () => {
// //     // Temporary mock data – replace with real API response later
// //     setRecentResumes([
// //       { id: '1', fileName: 'Resume_Frontend_Dev.pdf', createdAt: new Date().toISOString(), atsScore: 85 },
// //       { id: '2', fileName: 'FullStack_Resume.docx', createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(), atsScore: 72 },
// //       { id: '3', fileName: 'Data_Scientist_Resume.pdf', createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(), atsScore: 91 },
// //     ])
// //     setStats({
// //       totalAnalyses: 12,
// //       avgAtsScore: 78,
// //       interviewSessions: 5,
// //       skillGaps: 8,
// //     })
// //   }

// //   const handleNewAnalysis = () => navigate('/ats')
// //   const handleInterviewPrep = () => navigate('/interview')
// //   const handleViewAllResumes = () => navigate('/history') // if you have a history page

// //   if (loading) {
// //     return (
// //       <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
// //         <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
// //           <Skeleton height="120px" />
// //           <Skeleton height="300px" />
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
// //       {/* Welcome header */}
// //       <div style={{ marginBottom: 'var(--space-8)' }}>
// //         <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
// //           Welcome back 👋
// //         </h1>
// //         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
// //           Track your ATS performance and resume improvements
// //         </p>
// //       </div>

// //       {/* Stats grid */}
// //       <div style={{
// //         display: 'grid',
// //         gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
// //         gap: 'var(--space-4)',
// //         marginBottom: 'var(--space-8)',
// //       }}>
// //         <StatCard
// //           label="Total analyses"
// //           value={stats.totalAnalyses}
// //           icon="📄"
// //           color="var(--color-primary)"
// //         />
// //         <StatCard
// //           label="Average ATS score"
// //           value={`${stats.avgAtsScore}%`}
// //           icon="🎯"
// //           color={scoreColor(stats.avgAtsScore)}
// //         />
// //         <StatCard
// //           label="Interview sessions"
// //           value={stats.interviewSessions}
// //           icon="🎤"
// //           color="var(--color-info)"
// //         />
// //         <StatCard
// //           label="Skill gaps identified"
// //           value={stats.skillGaps}
// //           icon="📊"
// //           color="var(--color-warning)"
// //         />
// //       </div>

// //       {/* Recent resumes + quick actions */}
// //       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
// //         {/* Recent resumes list */}
// //         <div className="card" style={{ padding: 'var(--space-5)' }}>
// //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
// //             <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>Recent analyses</h3>
// //             <button className="btn btn-ghost btn-sm" onClick={handleViewAllResumes}>
// //               View all →
// //             </button>
// //           </div>
// //           {recentResumes.length === 0 ? (
// //             <p className="text-tertiary" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
// //               No resumes analyzed yet. <button className="btn-link" onClick={handleNewAnalysis}>Upload your first resume</button>
// //             </p>
// //           ) : (
// //             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
// //               {recentResumes.map(resume => (
// //                 <div key={resume.id} style={{
// //                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //                   padding: 'var(--space-3) var(--space-4)',
// //                   background: 'var(--color-bg-surface-2)',
// //                   borderRadius: 'var(--radius-md)',
// //                   border: '1px solid var(--color-border-surface)',
// //                 }}>
// //                   <div>
// //                     <p style={{ fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-1)' }}>
// //                       {resume.fileName}
// //                     </p>
// //                     <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
// //                       {formatDate(resume.createdAt)}
// //                     </p>
// //                   </div>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
// //                     <span style={{
// //                       fontWeight: 'var(--weight-bold)',
// //                       color: scoreColor(resume.atsScore),
// //                     }}>
// //                       {resume.atsScore}%
// //                     </span>
// //                     <button
// //                       className="btn btn-ghost btn-sm"
// //                       onClick={() => navigate(`/ats?resumeId=${resume.id}`)}
// //                     >
// //                       View
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Quick actions */}
// //         <div className="card" style={{ padding: 'var(--space-5)' }}>
// //           <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>
// //             Quick actions
// //           </h3>
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
// //             <button className="btn btn-primary" onClick={handleNewAnalysis}>
// //               + New ATS analysis
// //             </button>
// //             <button className="btn btn-secondary" onClick={handleInterviewPrep}>
// //               🎤 Start interview prep
// //             </button>
// //             <button className="btn btn-ghost" onClick={() => navigate('/linkedin-import')}>
// //               Import from LinkedIn
// //             </button>
// //           </div>
// //           <hr style={{ margin: 'var(--space-4) 0', borderColor: 'var(--color-border-surface)' }} />
// //           <div>
// //             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
// //               💡 Pro tip
// //             </p>
// //             <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
// //               Upload a resume with a targeted job description to get the most accurate ATS score and keyword suggestions.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // Stat card component
// // function StatCard({ label, value, icon, color }) {
// //   return (
// //     <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
// //       <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
// //       <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color, marginBottom: 'var(--space-1)' }}>
// //         {value}
// //       </p>
// //       <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{label}</p>
// //     </div>
// //   )
// // }

// // // Simple skeleton loader (same as used in ATSPage)
// // function Skeleton({ height }) {
// //   return (
// //     <div style={{
// //       height,
// //       borderRadius: 'var(--radius-lg)',
// //       background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
// //       backgroundSize: '200% 100%',
// //       animation: 'shimmer 1.4s infinite',
// //     }} />
// //   )
// // }
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import api from '../lib/axios';
// import { formatDate } from '../utils/formatDate';
// import { scoreColor } from '../utils/scoreColor';

// export default function DashboardPage() {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalAnalyses: 0,
//     avgAtsScore: 0,
//     interviewSessions: 0,
//     skillGaps: 0,
//   });
//   const [recentResumes, setRecentResumes] = useState([]);

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     fetchDashboardData();
//   }, [token]);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/history'); // ✅ correct endpoint
//       const historyData = response.data.data || [];

//       // Map history entries to the format expected by UI
//       const resumes = historyData.map(item => ({
//         id: item._id,
//         fileName: item.resumeId?.fileName || 'Resume',
//         createdAt: item.createdAt,
//         atsScore: item.resumeId?.atsScore || 0,
//       }));
//       setRecentResumes(resumes);

//       // Calculate stats
//       const total = resumes.length;
//       const sum = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
//       const avg = total > 0 ? Math.round(sum / total) : 0;
//       setStats({
//         totalAnalyses: total,
//         avgAtsScore: avg,
//         interviewSessions: 0,   // You can later fetch from InterviewSession model
//         skillGaps: 0,
//       });
//     } catch (err) {
//       console.error('Dashboard fetch error:', err);
//       // Fallback mock data (optional)
//       setRecentResumes([]);
//       toast.error('Could not load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewAnalysis = () => navigate('/ats');
//   const handleInterviewPrep = () => navigate('/interview');
//   const handleViewAllResumes = () => navigate('/history');

//   if (loading) {
//     return (
//       <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
//         <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
//           <Skeleton height="120px" />
//           <Skeleton height="300px" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
//       <div style={{ marginBottom: 'var(--space-8)' }}>
//         <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
//           Welcome back 👋
//         </h1>
//         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
//           Track your ATS performance and resume improvements
//         </p>
//       </div>

//       {/* Stats grid */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//         gap: 'var(--space-4)',
//         marginBottom: 'var(--space-8)',
//       }}>
//         <StatCard label="Total analyses" value={stats.totalAnalyses} icon="📄" color="var(--color-primary)" />
//         <StatCard label="Average ATS score" value={`${stats.avgAtsScore}%`} icon="🎯" color={scoreColor(stats.avgAtsScore)} />
//         <StatCard label="Interview sessions" value={stats.interviewSessions} icon="🎤" color="var(--color-info)" />
//         <StatCard label="Skill gaps identified" value={stats.skillGaps} icon="📊" color="var(--color-warning)" />
//       </div>

//       {/* Recent resumes + quick actions */}
//       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
//         <div className="card" style={{ padding: 'var(--space-5)' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
//             <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>Recent analyses</h3>
//             <button className="btn btn-ghost btn-sm" onClick={handleViewAllResumes}>View all →</button>
//           </div>
//           {recentResumes.length === 0 ? (
//             <p className="text-tertiary" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
//               No resumes analyzed yet. <button className="btn-link" onClick={handleNewAnalysis}>Upload your first resume</button>
//             </p>
//           ) : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
//               {recentResumes.map(resume => (
//                 <div key={resume.id} style={{
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: 'var(--space-3) var(--space-4)',
//                   background: 'var(--color-bg-surface-2)',
//                   borderRadius: 'var(--radius-md)',
//                   border: '1px solid var(--color-border-surface)',
//                 }}>
//                   <div>
//                     <p style={{ fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-1)' }}>{resume.fileName}</p>
//                     <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{formatDate(resume.createdAt)}</p>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
//                     <span style={{ fontWeight: 'var(--weight-bold)', color: scoreColor(resume.atsScore) }}>{resume.atsScore}%</span>
//                     <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/ats?resumeId=${resume.id}`)}>View</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="card" style={{ padding: 'var(--space-5)' }}>
//           <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>Quick actions</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
//             <button className="btn btn-primary" onClick={handleNewAnalysis}>+ New ATS analysis</button>
//             <button className="btn btn-secondary" onClick={handleInterviewPrep}>🎤 Start interview prep</button>
//             <button className="btn btn-ghost" onClick={() => navigate('/linkedin-import')}>Import from LinkedIn</button>
//           </div>
//           <hr style={{ margin: 'var(--space-4) 0', borderColor: 'var(--color-border-surface)' }} />
//           <div>
//             <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>💡 Pro tip</p>
//             <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
//               Upload a resume with a targeted job description to get the most accurate ATS score and keyword suggestions.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, icon, color }) {
//   return (
//     <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
//       <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
//       <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color, marginBottom: 'var(--space-1)' }}>{value}</p>
//       <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{label}</p>
//     </div>
//   );
// }

// function Skeleton({ height }) {
//   return (
//     <div style={{
//       height,
//       borderRadius: 'var(--radius-lg)',
//       background: 'linear-gradient(90deg, var(--color-accent-light) 25%, var(--color-primary-subtle) 50%, var(--color-accent-light) 75%)',
//       backgroundSize: '200% 100%',
//       animation: 'shimmer 1.4s infinite',
//     }} />
//   );
// }