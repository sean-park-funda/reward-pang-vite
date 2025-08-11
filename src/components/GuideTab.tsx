import React from 'react'
import guide1 from '../assets/guide1.png'
import guide2 from '../assets/guide2.png'
import guide3 from '../assets/guide3.png'
import guide4 from '../assets/guide4.png'

const GuideTab: React.FC = () => {
  return (
    <div className="tab-panel" style={{ textAlign: 'left' }}>

      <main style={{
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* STEP 1 */}
          <article style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              flex: '0 0 28px',
              height: '28px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#286EF1',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px'
            }}>1</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '-0.2px',
                color: '#111827'
              }}>
                내 수익링크에서 <span style={{ color: '#111827', fontWeight: '600' }}>바로가기</span> 버튼을 클릭해 주세요.
              </div>
              <figure style={{
                margin: '12px 0 0 0',
                width: '80%',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img 
                  src={guide1} 
                  alt="내 링크 페이지 바로가기 버튼" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </figure>
              <figcaption style={{
                marginTop: '8px',
                color: '#6b7280',
                fontSize: '13px'
              }}>내 링크 페이지 &gt; 바로가기 버튼</figcaption>
            </div>
          </article>

          {/* STEP 2 */}
          <article style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              flex: '0 0 28px',
              height: '28px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#286EF1',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px'
            }}>2</div>
            <div style={{ flex: 1 }}>
                             <div style={{
                 fontSize: '16px',
                 fontWeight: '600',
                 letterSpacing: '-0.2px',
                 color: '#111827'
               }}>
                 유튜브 영상에 나오는 상품을 클릭해서 쿠팡으로 가주세요. <span style={{ color: '#6b7280', fontSize: '14px' }}>(아래 이미지 참고)</span>
               </div>
                              <figure style={{
                  margin: '12px 0 0 0',
                  width: '70%',
                  aspectRatio: '9/16',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                 <img 
                   src={guide2} 
                   alt="유튜브 영상 하단/화면 내 상품 버튼 클릭" 
                   style={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain'
                   }}
                 />
               </figure>
              <figcaption style={{
                marginTop: '8px',
                color: '#6b7280',
                fontSize: '13px'
              }}>유튜브 영상 하단/화면 내 상품 버튼 클릭</figcaption>
            </div>
          </article>

          {/* STEP 3 */}
          <article style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              flex: '0 0 28px',
              height: '28px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#286EF1',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px'
            }}>3</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '-0.2px',
                color: '#111827'
              }}>
                쿠팡에서 원하는 상품을 구매해 주세요.
              </div>
                             <div style={{
                 marginTop: '6px',
                 fontSize: '14px',
                 color: '#6b7280'
               }}>
                 연결된 상품을 구매하지 않으셔도 쿠팡의 <span style={{ color: '#111827', fontWeight: '600' }}>모든 상품</span>에 적립이 됩니다.
               </div>
                              <figure style={{
                  margin: '12px 0 0 0',
                  width: '70%',
                  aspectRatio: '9/16',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                 <img 
                   src={guide3} 
                   alt="쿠팡에서 평소처럼 결제하면 자동 추적" 
                   style={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'contain'
                   }}
                 />
               </figure>
              <figcaption style={{
                marginTop: '8px',
                color: '#6b7280',
                fontSize: '13px'
              }}>쿠팡에서 평소처럼 결제하면 자동 추적</figcaption>
            </div>
          </article>

          {/* STEP 4 */}
          <article style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              flex: '0 0 28px',
              height: '28px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#286EF1',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px'
            }}>4</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '-0.2px',
                color: '#111827'
              }}>
                내 캐시백을 확인하고 정산을 받아 보세요.
              </div>
                             <div style={{
                 marginTop: '6px',
                 fontSize: '14px',
                 color: '#6b7280'
               }}>
                 구매확정 후 리워드가 적립되며, 정책에 따라 매월 말 정산됩니다.
               </div>
               <figure style={{
                 margin: '12px 0 0 0',
                 width: '80%',
                 borderRadius: '12px',
                 overflow: 'hidden'
               }}>
                <img 
                  src={guide4} 
                  alt="적립 내역 확인 및 정산 신청 화면" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </figure>
              <figcaption style={{
                marginTop: '8px',
                color: '#6b7280',
                fontSize: '13px'
              }}>적립 내역 확인 및 정산 신청 화면</figcaption>
            </div>
          </article>
        </section>

      </main>
    </div>
  )
}

export default GuideTab
