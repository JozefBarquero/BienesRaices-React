import { api } from './api';

export const getPropertyAiSummary = async (propertyId, lat, lng, propertyType, operationType) => {
  const cacheKey = `ai_summary_${propertyId}`;
  
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const payload = await api.ia.getResumen({ propertyId, lat, lng, propertyType, operationType });
  if (payload && payload.text) {
    sessionStorage.setItem(cacheKey, JSON.stringify(payload));
  }
  return payload;
};