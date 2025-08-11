import React, { useState } from 'react'

interface CoupangLink {
  id: string
  link_url: string
  link_code: string
  video_title: string
  is_assigned: boolean
  created_at: string
}

interface LinksTabProps {
  profileData: {
    coupangLink: CoupangLink | null
  } | null
}

const LinksTab: React.FC<LinksTabProps> = ({ profileData }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [pendingVideoUrl, setPendingVideoUrl] = useState<string>('')

  // 팝업 닫기 함수
  const closePopup = () => {
    setShowPopup(false)
    setPendingVideoUrl('')
  }

  // 팝업 확인 후 유튜브 열기 함수
  const confirmAndOpenYouTube = () => {
    if (pendingVideoUrl) {
      openYouTube(pendingVideoUrl)
    }
    closePopup()
  }

  // 유튜브 앱을 열거나 웹으로 이동하는 함수
  const openYouTube = (videoUrl: string) => {
    // 유튜브 비디오 ID 추출
    const videoId = extractVideoId(videoUrl)
    
    if (!videoId) {
      // 비디오 ID를 추출할 수 없으면 원본 URL로 이동
      window.open(videoUrl, '_blank')
      return
    }

    // 모바일 환경에서 유튜브 앱 열기 시도
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // 모바일에서는 intent URL 사용
      const intentUrl = `intent://www.youtube.com/watch?v=${videoId}#Intent;scheme=https;package=com.google.android.youtube;end`
      window.location.href = intentUrl
    } else {
      // 데스크톱에서는 유튜브 앱 스킴 시도 후 웹으로 폴백
      const appUrl = `youtube://www.youtube.com/watch?v=${videoId}`
      const webUrl = `https://www.youtube.com/watch?v=${videoId}`
      
      // 앱이 설치되어 있지 않으면 웹으로 이동
      window.open(appUrl, '_blank')
      
      // 앱이 열리지 않을 경우를 대비해 웹 URL도 준비
      setTimeout(() => {
        window.open(webUrl, '_blank')
      }, 1000)
    }
  }

  // 유튜브 URL에서 비디오 ID 추출
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  // 링크 복사 함수
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('링크가 복사되었습니다!')
    } catch (err) {
      console.error('복사 실패:', err)
      alert('복사에 실패했습니다.')
    }
  }

  return (
    <div className="tab-panel">
      {/* 팝업 */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-title">유튜브 영상이 나오면, 연결된 제품을 클릭해서 쿠팡으로 가주세요!</div>
            <div className="popup-desc">해당 제품을 구매하지 않으셔도, 쿠팡의 모든 상품에 대해 캐시백이 적립됩니다.</div>
            <div className="popup-buttons">
              <button className="btn primary" onClick={confirmAndOpenYouTube}>확인</button>
            </div>
          </div>
        </div>
      )}
      {/* 섹션 1: 내 수익 링크 */}
      <div className="section">
        <div className="section-title">내 수익 링크</div>
        <div className="section-desc">내 링크 → 영상 속 상품 클릭 → 쿠팡에서 결제 → 캐시백 적립!</div>

        {profileData?.coupangLink ? (
          <div className="card">
            <div className="url">{profileData.coupangLink.link_url}</div>
            <div className="btn-group">
              <button 
                className="btn primary" 
                onClick={() => {
                  if (profileData?.coupangLink?.link_url) {
                    setPendingVideoUrl(profileData.coupangLink.link_url)
                    setShowPopup(true)
                  }
                }}
              >
                바로 가기
              </button>
              <button 
                className="btn neutral" 
                onClick={() => profileData?.coupangLink?.link_url && copyToClipboard(profileData.coupangLink.link_url)}
              >
                복사하기
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="url">등록된 링크가 없습니다</div>
            <div className="btn-group">
              <button className="btn primary">등록하기</button>
            </div>
          </div>
        )}
      </div>

      {/* 섹션 2: 캐시백 받는 방법 */}
      <div className="section" style={{ textAlign: 'left' }}>
        <div className="section-title">캐시백 받는 방법</div>
        <div className="steps">
          <div className="step">
            <div className="badge">1</div>
            <div className="step-text">
              <div className="step-title">내 수익 링크 '바로 가기' 클릭</div>
              <div className="step-desc">리워드팡에서 내 링크로 유튜브 쇼츠 영상에 들어가요.</div>
            </div>
          </div>
          <div className="step">
            <div className="badge">2</div>
            <div className="step-text">
              <div className="step-title">영상 속 상품 버튼 누르기</div>
              <div className="step-desc">쇼츠 화면 안의 쿠팡 상품 버튼을 눌러 쿠팡으로 이동해요.</div>
            </div>
          </div>
          <div className="step">
            <div className="badge">3</div>
            <div className="step-text">
              <div className="step-title">쿠팡에서 원하는 상품 결제</div>
              <div className="step-desc">영상 속 상품뿐 아니라 어떤 상품이든 구매하면 돼요.</div>
            </div>
          </div>
          <div className="step">
            <div className="badge">4</div>
            <div className="step-text">
              <div className="step-title">자동으로 캐시백 적립</div>
              <div className="step-desc">결제 금액의 최대 3%가 자동으로 적립돼요.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinksTab
