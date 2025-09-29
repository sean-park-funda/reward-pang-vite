import { useCallback, useState, useEffect } from 'react'
import { appLogin } from '@apps-in-toss/web-framework'
import { getApiUrl } from './utils/apiConfig'
import LinksTab from './components/LinksTab'
import CashbackTab from './components/CashbackTab'
import GuideTab from './components/GuideTab'
import OnboardingScreen from './components/OnboardingScreen'
import './App.css'

interface TossUser {
  userKey: number
  scope: string
  agreedTerms: string[]
  policy: string | null
  certTxId: string | null
  name: string
  callingCode: string
  phone: string
  birthday: string | null
  ci: string | null
  di: string | null
  gender: string | null
  nationality: string | null
  email: string | null
}

interface RewardpangUser {
  id: string
  phone: string
  email: string
  metadata: Record<string, unknown>
  group_id: string
  coupang_link_id: string
  created_at: string
  updated_at: string
}

interface RewardpangSession {
  access_token: string
  refresh_token: string
}

interface LoginMeResponse {
  success: boolean
  toss_user: TossUser
  rewardpang_user: RewardpangUser | null
  rewardpang_session: RewardpangSession | null
  rewardpang_error: string | null
  error: string | null
}

interface GroupPurchase {
  id: string
  user_id: string | null
  order_id: string
  product_name: string
  purchase_amount: number
  reward_amount: number
  purchase_date: string
  exact_purchase_date: boolean
  status: string
  created_at: string
  buyer: string | null | { id: string; phone: string; isMe: boolean }
}

interface GroupPurchasesResponse {
  success: boolean
  data: {
    purchases: GroupPurchase[]
  }
}

interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_number: string
  account_holder: string
  created_at: string
  updated_at: string
}

interface CoupangLink {
  id: string
  link_url: string
  link_code: string
  video_title: string
  is_assigned: boolean
  created_at: string
}

interface ProfileResponse {
  success: boolean
  user: {
    id: string
    phone: string
    email: string
    username: string | null
    group_id: string
    created_at: string
    updated_at: string
  }
  bankAccount: BankAccount | null
  coupangLink: CoupangLink | null
}

interface Settlement {
  id: string
  user_id: string
  user_group_id: string
  amount: number
  bank_account_number: string
  settlement_amount: number
  status: 'pending' | 'completed' | 'rejected'
  application_date: string
  settlement_date: string | null
  created_at: string
  updated_at: string
}

interface SettlementsResponse {
  success: boolean
  data: {
    settlements: Settlement[]
  }
}

function App() {
  const [loginMeResponse, setLoginMeResponse] = useState<LoginMeResponse | null>(null)
  const [groupPurchases, setGroupPurchases] = useState<GroupPurchase[]>([])
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [activeTab, setActiveTab] = useState<'links' | 'cashback' | 'guide'>('links')
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getProfile = useCallback(async (token: string) => {
    try {
      console.log('프로필 정보 요청 중...')
      
      const response = await fetch(getApiUrl('/api/user/profile'), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProfileResponse = await response.json()
      console.log('프로필 정보 응답:', data)
      
      if (data.success) {
        setProfileData(data)
        console.log('프로필 정보 획득 성공!')
      } else {
        throw new Error('프로필 정보 응답이 올바르지 않습니다.')
      }
      
    } catch (error) {
      console.error('프로필 정보 요청 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error))
      alert(`프로필 정보 획득에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const getGroupPurchases = useCallback(async (token: string) => {
    try {
      console.log('그룹 구매 정보 요청 중...')
      console.log('사용된 토큰:', token)
      
      const response = await fetch(getApiUrl('/api/purchases/group'), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      console.log('API 응답 상태:', response.status)
      console.log('API 응답 헤더:', response.headers)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: GroupPurchasesResponse = await response.json()
      console.log('그룹 구매 정보 응답:', data)
      console.log('응답 success:', data.success)
      console.log('응답 data:', data.data)
      console.log('응답 purchases 배열:', data.data?.purchases)
      console.log('purchases 배열 길이:', data.data?.purchases?.length)
      
      if (data.success && data.data.purchases) {
        setGroupPurchases(data.data.purchases)
        console.log('그룹 구매 정보 획득 성공!')
        console.log('설정된 groupPurchases:', data.data.purchases)
      } else {
        console.error('API 응답이 올바르지 않음:', data)
        throw new Error('그룹 구매 정보 응답이 올바르지 않습니다.')
      }
      
    } catch (error) {
      console.error('그룹 구매 정보 요청 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error))
      alert(`그룹 구매 정보 획득에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const getSettlements = useCallback(async (token: string) => {
    try {
      console.log('정산 기록 요청 중...')
      
      const response = await fetch(getApiUrl('/api/settlements/my-settlements'), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SettlementsResponse = await response.json()
      console.log('정산 기록 응답:', data)
      
      if (data.success && data.data.settlements) {
        setSettlements(data.data.settlements)
        console.log('정산 기록 획득 성공!')
        console.log('설정된 settlements:', data.data.settlements)
      } else {
        console.error('정산 기록 API 응답이 올바르지 않음:', data)
        throw new Error('정산 기록 응답이 올바르지 않습니다.')
      }
      
    } catch (error) {
      console.error('정산 기록 요청 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error))
      alert(`정산 기록 획득에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const getLoginMe = useCallback(async (authorizationCode: string, referrer: string) => {
    try {
      console.log('토스 API 서버에 login-me 요청 중...')
      
      const response = await fetch(getApiUrl('/api/toss/login-me'), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizationCode,
          referrer,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: LoginMeResponse = await response.json()
      console.log('Login-me 응답:', data)
      
      if (data.success) {
        setLoginMeResponse(data)
        console.log('로그인 성공!')
        console.log('토스 유저:', data.toss_user)
        console.log('리워드팡 유저:', data.rewardpang_user)
        console.log('세션:', data.rewardpang_session)
        
        // access_token이 있으면 그룹 구매 정보, 프로필 정보, 정산 기록 요청
        if (data.rewardpang_session?.access_token) {
          await Promise.all([
            getGroupPurchases(data.rewardpang_session.access_token),
            getProfile(data.rewardpang_session.access_token),
            getSettlements(data.rewardpang_session.access_token)
          ])
        }
      } else {
        throw new Error(data.error || '로그인에 실패했습니다.')
      }
      
    } catch (error) {
      console.error('Login-me 요청 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error))
      alert(`로그인에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [getGroupPurchases, getProfile, getSettlements])

  const handleLogin = useCallback(async () => {
    try {
      console.log('로그인 시작')
      setIsLoading(true)
      setShowOnboarding(false) // 온보딩 화면을 즉시 숨기고 로딩 화면 표시
      
      /**
       * appLogin을 호출하면
       * - 토스 로그인을 처음 진행하는 토스 로그인 창이 열리고, 앱인토스 콘솔에서 등록한 약관 동의 화면이 표시돼요. 사용자가 필수 약관에 동의하면 인가 코드가 반환돼요.
       * - 토스 로그인을 이미 진행한 경우 별도의 로그인 창 없이 바로 인가 코드가 반환돼요.
       */
      console.log('appLogin 함수 호출 중...')
      const { authorizationCode, referrer } = await appLogin()
      
      console.log('appLogin 성공!', { authorizationCode, referrer })
      
      // 토스 로그인 완료 후 데이터 로딩 시작
      console.log('데이터 로딩 시작...')
      
      // 토스 API 서버에서 login-me 요청 (access token + 사용자 정보)
      await getLoginMe(authorizationCode, referrer)
      
      // 온보딩 완료 표시
      localStorage.setItem('rewardpang-onboarding-completed', 'true')
      
    } catch (error) {
      console.error('로그인 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 스택:', error instanceof Error ? error.stack : 'No stack trace')
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
      // 에러 발생 시 온보딩 화면으로 돌아가기
      setShowOnboarding(true)
    } finally {
      console.log('로그인 프로세스 완료')
      setIsLoading(false)
    }
  }, [getLoginMe])

  // 페이지 로드 시 온보딩 체크 및 로그인 실행
  useEffect(() => {
    // TODO: 임시로 온보딩 항상 표시 (테스트용)
    // 나중에 되돌리려면 아래 주석을 해제하고 위의 임시 코드를 주석 처리하면 됩니다
    setShowOnboarding(true)
    setIsLoading(false)
    
    // 원래 코드 (나중에 되돌릴 때 사용):
    // const onboardingCompleted = localStorage.getItem('rewardpang-onboarding-completed')
    // 
    // if (onboardingCompleted === 'true') {
    //   // 온보딩을 이미 본 경우 자동 로그인
    //   handleLogin()
    // } else {
    //   // 온보딩을 처음 보는 경우 온보딩 화면 표시
    //   setShowOnboarding(true)
    //   setIsLoading(false)
    // }
  }, [handleLogin])

  // 총 리워드 계산
  const totalReward = groupPurchases.reduce((total, purchase) => total + purchase.reward_amount, 0)

  // 지급된 캐시백 계산 (status가 'completed'인 정산의 settlement_amount 합계)
  const paidCashback = settlements
    .filter(settlement => settlement.status === 'completed')
    .reduce((total, settlement) => total + settlement.settlement_amount, 0)

  // 캐시백 관련 데이터 (실제 데이터 사용)
  const cashbackData = {
    totalCashback: totalReward, // 실제 총 리워드 사용
    paidCashback: paidCashback, // 실제 지급된 캐시백
    confirmedCashback: 0, // TODO: 확정 캐시백 계산 로직 추가 예정
    nextPaymentDate: '2024-02-15' // TODO: API에서 받아올 예정
  }

  return (
    <div className="app">
      {showOnboarding ? (
        <OnboardingScreen onLogin={handleLogin} />
      ) : isLoading ? (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>리워드팡</h2>
            <p>데이터를 불러오는 중...</p>
            <div className="loading-steps">
              <div className="step">사용자 정보 확인 중...</div>
              <div className="step">캐시백 데이터 로딩 중...</div>
              <div className="step">정산 기록 확인 중...</div>
            </div>
          </div>
        </div>
      ) : loginMeResponse ? (
        <div className="user-summary">
          {/* 총 리워드 표시 */}
          <div style={{ padding: '0 16px' }}>
            <div className="total-reward-section">
              <h2>총 캐시백</h2>
              <div className="total-reward-amount">
                {totalReward.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              내 링크
            </button>
            <button 
              className={`tab-button ${activeTab === 'cashback' ? 'active' : ''}`}
              onClick={() => setActiveTab('cashback')}
            >
              내 캐시백
            </button>
            <button 
              className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              이용방법
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="tab-content">
            {activeTab === 'links' && <LinksTab profileData={profileData} />}
            {activeTab === 'cashback' && (
              <CashbackTab 
                cashbackData={cashbackData} 
                groupPurchases={groupPurchases} 
                settlements={settlements} 
                bankAccount={profileData?.bankAccount || null}
                userGroupId={loginMeResponse?.rewardpang_user?.group_id || ''}
                accessToken={loginMeResponse?.rewardpang_session?.access_token || ''}
                onSettlementCreated={(settlement) => {
                  // 새 정산이 생성되면 settlements 배열에 추가
                  setSettlements(prev => [settlement, ...prev])
                }}
              />
            )}
            {activeTab === 'guide' && <GuideTab />}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
