import React, { useEffect } from 'react'

const GuideTab: React.FC = () => {
  useEffect(() => {
    // FAQ 토글 기능
    const faqItems = document.querySelectorAll('.faq-item')
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question')
      if (question) {
        question.addEventListener('click', () => {
          item.classList.toggle('active')
        })
      }
    })
  }, [])

  return (
    <div className="tab-panel" style={{ textAlign: 'left' }}>
      <header style={{
        backgroundColor: '#F9FAFB',
        padding: '32px 20px',
        textAlign: 'left'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1A1A1A',
          textAlign: 'left',
          padding: 0
        }}>리워드팡 이용방법</h1>
        <p style={{
          fontSize: '1rem',
          color: '#7F7F7F',
          textAlign: 'left'
        }}>쉽고 간단하게, 쇼핑할 때마다 캐시백 받아요</p>
      </header>

      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'left'
      }}>
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#3182F6',
            marginBottom: '6px',
            textAlign: 'left'
          }}>1. 가입하기</h2>
          <p style={{
            fontSize: '1rem',
            color: '#4F4F4F',
            marginBottom: '12px',
            textAlign: 'left'
          }}>토스 계정으로 로그인하면 간단하게 가입할 수 있어요. 추가 정보 입력 없이 바로 시작해요.</p>
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A0AEC0',
            fontSize: '0.95rem'
          }}>이미지 영역</div>
        </div>

        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#3182F6',
            marginBottom: '6px',
            textAlign: 'left'
          }}>2. 영상 링크 받기</h2>
          <p style={{
            fontSize: '1rem',
            color: '#4F4F4F',
            marginBottom: '12px',
            textAlign: 'left'
          }}>가입하면 나만의 고유한 <strong>유튜브 영상 링크</strong>가 발급돼요. 이 링크가 회원님의 마케팅 링크예요. 영상에서 노출되는 상품 버튼을 클릭하고 쿠팡으로 접속해야 캐시백이 정상적으로 적립돼요.</p>
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A0AEC0',
            fontSize: '0.95rem'
          }}>이미지 영역</div>
        </div>

        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#3182F6',
            marginBottom: '6px',
            textAlign: 'left'
          }}>3. 링크 공유하기</h2>
          <p style={{
            fontSize: '1rem',
            color: '#4F4F4F',
            marginBottom: '12px',
            textAlign: 'left'
          }}>영상 링크를 친구, 가족, 지인에게 보내서 함께 쓸 수 있어요. 카톡, 문자, SNS 어디든 공유 가능해요. 내가 직접 쇼핑해도 되고, 친구가 이 링크로 구매한 모든 금액도 내 캐시백으로 쌓여요.</p>
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A0AEC0',
            fontSize: '0.95rem'
          }}>이미지 영역</div>
        </div>

        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#3182F6',
            marginBottom: '6px',
            textAlign: 'left'
          }}>4. 쇼핑 & 적립</h2>
          <p style={{
            fontSize: '1rem',
            color: '#4F4F4F',
            marginBottom: '12px',
            textAlign: 'left'
          }}>유튜브 영상 링크를 통해 쿠팡에서 상품을 구매하면 48시간 내로 내 캐시백 탭 화면에 구매 내역과 예정 캐시백이 표시돼요. 구매가 확정되면 캐시백으로 적립돼요.</p>
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A0AEC0',
            fontSize: '0.95rem'
          }}>이미지 영역</div>
        </div>

        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#3182F6',
            marginBottom: '6px',
            textAlign: 'left'
          }}>5. 캐시백 받기</h2>
          <p style={{
            fontSize: '1rem',
            color: '#4F4F4F',
            marginBottom: '12px',
            textAlign: 'left'
          }}>적립된 캐시백은 내 캐시백 탭 화면에서 확인할 수 있어요. 정산 신청을 해주면 토스 포인트로 받거나 계좌로 출금할 수 있어요.</p>
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#A0AEC0',
            fontSize: '0.95rem'
          }}>이미지 영역</div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#F9FAFB',
        borderTop: '1px solid #E2E8F0',
        padding: '20px',
        textAlign: 'left'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1A1A1A',
          textAlign: 'left'
        }}>자주 묻는 질문</h3>
        
        <div className="faq-item" style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
          <div className="faq-question" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#1A1A1A',
            textAlign: 'left'
          }}>
            영상 링크는 어디서 확인하나요?
            <span className="faq-toggle" style={{
              fontSize: '1.2rem',
              color: '#3182F6',
              transition: 'transform 0.3s ease'
            }}>+</span>
          </div>
          <div className="faq-answer" style={{
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            color: '#4F4F4F',
            fontSize: '0.95rem',
            paddingLeft: '8px',
            textAlign: 'left'
          }}>
            가입 후 메인 화면에서 바로 확인할 수 있어요.
          </div>
        </div>
        
        <div className="faq-item" style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
          <div className="faq-question" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#1A1A1A',
            textAlign: 'left'
          }}>
            캐시백은 언제 적립되나요?
            <span className="faq-toggle" style={{
              fontSize: '1.2rem',
              color: '#3182F6',
              transition: 'transform 0.3s ease'
            }}>+</span>
          </div>
          <div className="faq-answer" style={{
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            color: '#4F4F4F',
            fontSize: '0.95rem',
            paddingLeft: '8px',
            textAlign: 'left'
          }}>
            구매 후 48시간 이내에 내 캐시백 탭에 표시돼요.
          </div>
        </div>
        
        <div className="faq-item" style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
          <div className="faq-question" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#1A1A1A',
            textAlign: 'left'
          }}>
            친구가 구매한 것도 적립되나요?
            <span className="faq-toggle" style={{
              fontSize: '1.2rem',
              color: '#3182F6',
              transition: 'transform 0.3s ease'
            }}>+</span>
          </div>
          <div className="faq-answer" style={{
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            color: '#4F4F4F',
            fontSize: '0.95rem',
            paddingLeft: '8px',
            textAlign: 'left'
          }}>
            네, 영상 링크를 통해 구매한 모든 금액이 적립돼요.
          </div>
        </div>
        
        <div className="faq-item" style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
          <div className="faq-question" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#1A1A1A',
            textAlign: 'left'
          }}>
            정산 신청은 어떻게 하나요?
            <span className="faq-toggle" style={{
              fontSize: '1.2rem',
              color: '#3182F6',
              transition: 'transform 0.3s ease'
            }}>+</span>
          </div>
          <div className="faq-answer" style={{
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            color: '#4F4F4F',
            fontSize: '0.95rem',
            paddingLeft: '8px',
            textAlign: 'left'
          }}>
            내 캐시백 탭에서 '정산 신청' 버튼을 누르면 돼요.
          </div>
        </div>
        
        <div className="faq-item" style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
          <div className="faq-question" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#1A1A1A',
            textAlign: 'left'
          }}>
            캐시백은 어떻게 받을 수 있나요?
            <span className="faq-toggle" style={{
              fontSize: '1.2rem',
              color: '#3182F6',
              transition: 'transform 0.3s ease'
            }}>+</span>
          </div>
          <div className="faq-answer" style={{
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            color: '#4F4F4F',
            fontSize: '0.95rem',
            paddingLeft: '8px',
            textAlign: 'left'
          }}>
            토스 포인트로 받거나 계좌로 출금할 수 있어요.
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideTab
