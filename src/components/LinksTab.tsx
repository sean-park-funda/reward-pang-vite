import React from 'react'

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

  return (
    <div className="tab-panel">
      <div className="section">
        <div className="section-title">내 영상 링크</div>
        <div className="section-desc">이 링크로 쿠팡에서 구매하셔야 캐시백이 지급돼요</div>
        {profileData?.coupangLink ? (
          <div className="card link-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div 
              className="card-text" 
              style={{ flex: 1, marginRight: '12px', wordBreak: 'break-all', cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
              onClick={() => profileData?.coupangLink?.link_url && openYouTube(profileData.coupangLink.link_url)}
            >
              {profileData.coupangLink.link_url}
            </div>
            <button className="primary-btn" style={{ flexShrink: 0, backgroundColor: '#ffffff', borderColor: '#6c757d', color: '#6c757d' }}>복사</button>
          </div>
        ) : (
          <div className="card link-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-text" style={{ flex: 1, marginRight: '12px' }}>등록된 링크가 없습니다</div>
            <button className="primary-btn" style={{ flexShrink: 0 }}>등록</button>
          </div>
        )}
        <div className="info-box" style={{ width: '100%' }}>링크를 친구와 공유할 수 있어요</div>
      </div>

      <div className="section">
        <div className="section-title" style={{ fontSize: '18px', fontWeight: 'bold' }}>캐시백 받는 방법</div>
        <ul className="step-list" style={{ textAlign: 'left', listStyle: 'none', paddingLeft: 0 }}>
          <li>
            <span 
              style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
              onClick={() => profileData?.coupangLink?.link_url && openYouTube(profileData.coupangLink.link_url)}
            >
              내 영상 보러가기
            </span>
            클릭해서 유튜브로 이동
          </li>
          <li>유튜브 영상에서 쿠팡 상품 클릭하기</li>
          <li>쿠팡 접속해서 아무 상품이나 구매</li>
          <li>토스 포인트로 캐시백 적립</li>
        </ul>
      </div>
    </div>
  )
}

export default LinksTab
