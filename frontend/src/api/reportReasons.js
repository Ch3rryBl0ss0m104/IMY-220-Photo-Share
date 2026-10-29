import { apiRequest } from './client.js';

export const getReportReasons = () => apiRequest('/api/report-reasons');
