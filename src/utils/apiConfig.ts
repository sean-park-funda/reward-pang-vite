/**
 * API 기본 URL을 환경변수 또는 런타임 감지로 가져오는 함수
 */
export const getApiBaseUrl = (): string => {
  // 1. 환경변수 우선 확인 (임시로 비활성화)
  // const envApiUrl = import.meta.env.VITE_API_BASE_URL
  // if (envApiUrl) {
  //   console.log('환경변수에서 API URL 사용:', envApiUrl)
  //   return envApiUrl
  // }

  // // 2. 런타임 감지 (환경변수가 없을 때)
  // const isLocalhost = window.location.hostname === 'localhost' || 
  //                    window.location.hostname === '127.0.0.1' ||
  //                    window.location.hostname.includes('localhost')
  
  // if (isLocalhost) {
  //   const localUrl = 'http://localhost:8080'
  //   console.log('로컬 환경 감지, API URL 사용:', localUrl)
  //   return localUrl
  // }

  // // 3. 프로덕션 기본값
  // const productionUrl = 'https://api.rewardpang.com'
  // console.log('프로덕션 환경 감지, API URL 사용:', productionUrl)
  // return productionUrl

  return 'http://localhost:8080'
  // return 'https://api.rewardpang.com'
}

/**
 * API 엔드포인트 URL을 생성하는 함수
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}${endpoint}`
}
