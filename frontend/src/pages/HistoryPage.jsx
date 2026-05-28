// src/pages/HistoryPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { formatDate } from '../utils/formatDate';
import { scoreColor } from '../utils/scoreColor';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/history');
      setHistory(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (resumeId) => {
    navigate(`/ats?resumeId=${resumeId}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this history entry?')) return;
    try {
      await api.delete(`/history/${id}`);
      toast.success('Deleted');
      fetchHistory();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <h1>Resume History</h1>
      {history.length === 0 ? (
        <p>No analyses yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map(item => (
            <div key={item._id} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.resumeId?.fileName || 'Resume'}</strong>
                  <p className="text-tertiary">{formatDate(item.createdAt)}</p>
                </div>
                <div>
                  <span style={{ color: scoreColor(item.resumeId?.atsScore || 0), fontWeight: 'bold' }}>
                    {item.resumeId?.atsScore || 0}%
                  </span>
                  <button onClick={() => handleViewDetails(item.resumeId?._id)} style={{ marginLeft: '1rem' }}>View</button>
                  <button onClick={() => handleDelete(item._id)} style={{ marginLeft: '1rem', color: 'red' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { useAuth } from '../context/AuthContext';
// import api from '../lib/axios';
// import { formatDate } from '../utils/formatDate';
// import { scoreColor } from '../utils/scoreColor';
// import toast from 'react-hot-toast';

// export default function HistoryPage() {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     fetchHistory();
//   }, [token]);

//   const fetchHistory = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/history');
//       const data = response.data.data || [];
//       setHistory(data);
//     } catch (err) {
//       console.error('Fetch history error:', err);
//       toast.error('Failed to load history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewResume = (resumeId) => {
//     navigate(`/ats?resumeId=${resumeId}`);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this history entry?')) return;
//     try {
//       await api.delete(`/history/${id}`);
//       toast.success('Deleted');
//       fetchHistory(); // refresh
//     } catch (err) {
//       toast.error('Delete failed');
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
//         <div style={{ height: 200, borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-light)', animation: 'pulse 1.5s infinite' }} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
//       <div style={{ marginBottom: 'var(--space-6)' }}>
//         <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
//           Resume Analysis History
//         </h1>
//         <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
//           All your past resume analyses
//         </p>
//       </div>

//       {history.length === 0 ? (
//         <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
//           <p className="text-tertiary">No resumes analyzed yet.</p>
//           <button className="btn btn-primary" onClick={() => navigate('/ats')} style={{ marginTop: 'var(--space-4)' }}>
//             Analyze your first resume
//           </button>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
//           {history.map((item) => (
//             <div key={item._id} className="card" style={{ padding: 'var(--space-4)' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
//                 <div>
//                   <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-1)' }}>
//                     {item.resumeId?.fileName || 'Resume'}
//                   </h3>
//                   <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
//                     {formatDate(item.createdAt)} · {item.action}
//                   </p>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
//                   <span style={{ fontWeight: 'var(--weight-bold)', color: scoreColor(item.resumeId?.atsScore || 0) }}>
//                     ATS: {item.resumeId?.atsScore || 0}%
//                   </span>
//                   <button className="btn btn-ghost btn-sm" onClick={() => handleViewResume(item.resumeId?._id)}>
//                     View Details
//                   </button>
//                   <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(item._id)}>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }