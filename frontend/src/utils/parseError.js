// src/utils/parseError.js
export function parseError(err) {
  return err?.response?.data?.message
    || err?.message
    || 'Something went wrong. Please try again.'
}