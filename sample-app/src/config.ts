// 環境設定
export const config = {
  environment: process.env.REACT_APP_ENVIRONMENT || 'local',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  
  // 環境判定
  isLocal: () => process.env.REACT_APP_ENVIRONMENT === 'local',
  isAzure: () => process.env.REACT_APP_ENVIRONMENT === 'azure',
  isMock: () => process.env.REACT_APP_ENVIRONMENT === 'mock',
};

export default config;
