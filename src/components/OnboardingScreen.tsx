import React from 'react'
import './OnboardingScreen.css'

interface OnboardingScreenProps {
  onLogin: () => void
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onLogin }) => {
  return (
    <div className="onboarding">
      <div className="container">
        <div className="main-title">
          쿠팡 쇼핑, <span className="highlight">이제 돌려받으세요</span><br />
          구매할 때마다 최대 3% 캐시백
        </div>
        <div className="sub-text">
          리워드팡은 <strong>쿠팡 쇼핑 시 현금으로 캐시백</strong>을 드리는 서비스입니다.<br />
          가입 후 발급받은 <strong>내 쇼핑 링크</strong>를 통해 쿠팡에서 구매하면 캐시백이 자동 적립돼요.
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">🆓</div>
            <div className="feature-text">
              <div className="main">무료 가입</div>
              <div className="sub">가입만 하면 내 쇼핑 링크 발급</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-text">
              <div className="main">최대 3% 적립</div>
              <div className="sub">결제 금액에 따라 캐시백 지급</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💳</div>
            <div className="feature-text">
              <div className="main">내 계좌로 현금 받기</div>
              <div className="sub">매월 신청하면 바로 지급</div>
            </div>
          </div>
        </div>
      </div>

      <button className="cta-btn" onClick={onLogin}>
        토스로 로그인
      </button>
    </div>
  )
}

export default OnboardingScreen
