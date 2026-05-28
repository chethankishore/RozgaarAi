import axios from '../lib/axios';

/**
 * Analyze resume against job description using backend API
 * @param {Object} params
 * @param {File} params.file - Resume file (PDF/DOC/DOCX)
 * @param {string} params.jdText - Job description text
 * @param {string} [params.token] - Auth token (optional, will use axios default if not provided)
 * @returns {Promise<Object>} ATS analysis result
 */
export async function analyze({ file, jdText, token }) {
	if (!file || !jdText) throw new Error('File and job description are required');
	const formData = new FormData();
	formData.append('resume', file);
	formData.append('jobDescription', jdText);

	const headers = {
		'Content-Type': 'multipart/form-data',
	};
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const response = await axios.post('/resume/analyze', formData, { headers });
	return response.data;
}
export async function applySuggestion({ resumeId, suggestions, token }) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await axios.post('/resume/apply-suggestions', { resumeId, suggestions }, { headers });
  return response.data; // { correctedResumeText }
}