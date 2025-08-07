import { useCallback, useState, useEffect } from 'react'
import { appLogin } from '@apps-in-toss/web-framework'
import { getApiUrl } from './utils/apiConfig'
import LinksTab from './components/LinksTab'
import CashbackTab from './components/CashbackTab'
import GuideTab from './components/GuideTab'
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

function App() {
  const [loginMeResponse, setLoginMeResponse] = useState<LoginMeResponse | null>(null)
  const [groupPurchases, setGroupPurchases] = useState<GroupPurchase[]>([])
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'links' | 'cashback' | 'guide'>('links')

  const getProfile = async (token: string) => {
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
  }

  const getGroupPurchases = async (token: string) => {
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
  }

  const getLoginMe = async (authorizationCode: string, referrer: string) => {
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
        
        // access_token이 있으면 그룹 구매 정보와 프로필 정보 요청
        if (data.rewardpang_session?.access_token) {
          await Promise.all([
            getGroupPurchases(data.rewardpang_session.access_token),
            getProfile(data.rewardpang_session.access_token)
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
  }

  const handleLogin = useCallback(async () => {
    try {
      console.log('로그인 시작')
      
      /**
       * appLogin을 호출하면
       * - 토스 로그인을 처음 진행하는 토스 로그인 창이 열리고, 앱인토스 콘솔에서 등록한 약관 동의 화면이 표시돼요. 사용자가 필수 약관에 동의하면 인가 코드가 반환돼요.
       * - 토스 로그인을 이미 진행한 경우 별도의 로그인 창 없이 바로 인가 코드가 반환돼요.
       */
      console.log('appLogin 함수 호출 중...')
      const { authorizationCode, referrer } = await appLogin()
      
      console.log('appLogin 성공!', { authorizationCode, referrer })
      
      // 토스 API 서버에서 login-me 요청 (access token + 사용자 정보)
      await getLoginMe(authorizationCode, referrer)
      
    } catch (error) {
      console.error('로그인 실패:', error)
      console.error('에러 타입:', typeof error)
      console.error('에러 이름:', error instanceof Error ? error.name : 'Unknown')
      console.error('에러 스택:', error instanceof Error ? error.stack : 'No stack trace')
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      console.log('로그인 프로세스 완료')
    }
  }, [])

  // 페이지 로드 시 자동으로 로그인 실행
  useEffect(() => {
    handleLogin()
  }, [handleLogin])

  // 총 리워드 계산
  const totalReward = groupPurchases.reduce((total, purchase) => total + purchase.reward_amount, 0)

  // 캐시백 관련 데이터 (실제 데이터 사용)
  const cashbackData = {
    totalCashback: totalReward, // 실제 총 리워드 사용
    paidCashback: 0, // 지급된 캐시백 (나중에 API에서 받아올 예정)
    nextPaymentDate: '2024-02-15'
  }

  return (
    <div className="app">
      {loginMeResponse && (
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
            {activeTab === 'cashback' && <CashbackTab cashbackData={cashbackData} groupPurchases={groupPurchases} />}
            {activeTab === 'guide' && <GuideTab />}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
