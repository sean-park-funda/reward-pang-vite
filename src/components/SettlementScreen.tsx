import React, { useState, useEffect } from 'react'
import './SettlementScreen.css'

interface SettlementScreenProps {
  cashbackData: {
    totalCashback: number
    paidCashback: number
    nextPaymentDate: string
  }
  onClose: () => void
}

const SettlementScreen: React.FC<SettlementScreenProps> = ({ cashbackData, onClose }) => {
  const [mode, setMode] = useState<'all' | 'partial'>('all')
  const [amount, setAmount] = useState('')
  const [showDoneSheet, setShowDoneSheet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isButtonActive, setIsButtonActive] = useState(false)

  // 정산 가능 캐시백 (총 캐시백 - 지급된 캐시백)
  // API가 없으므로 더미 데이터로 설정
  const availableCashback = Math.max(0, cashbackData.totalCashback - cashbackData.paidCashback)
  const scheduledCashback = availableCashback // 지급 예정 캐시백 (현재는 정산 가능 금액과 동일)
  const payoutDate = cashbackData.nextPaymentDate || '2024.12.31'

  // 정산할 금액 계산
  const getAmountToSettle = () => {
    if (mode === 'all') return availableCashback
    const v = parseInt(amount || '0', 10)
    return v
  }

  // 유효성 검사
  const validate = () => {
    // 금액 검증
    let validAmount = true
    let showError = ''
    const settleAmount = getAmountToSettle()

    if (mode === 'partial') {
      if (settleAmount < 1000) {
        validAmount = false
        showError = '최소 1,000원부터 신청해요.'
      } else if (settleAmount > availableCashback) {
        validAmount = false
        showError = '정산 가능 금액을 초과했어요.'
      } else if (settleAmount % 1000 !== 0) {
        validAmount = false
        showError = '1,000원 단위로 입력해 주세요.'
      }
    } else {
      if (availableCashback <= 0) {
        validAmount = false
        showError = '정산할 금액이 없어요.'
      }
    }

    setErrorMessage(showError)
    return validAmount
  }

  // 상태 변경 시 유효성 검사 실행
  useEffect(() => {
    if (availableCashback > 0) {
      const isValid = validate()
      setIsButtonActive(isValid)
    } else {
      setIsButtonActive(false)
    }
  }, [mode, amount, availableCashback])

  // 입력값 변경 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setAmount(value)
  }

  // 제출 처리
  const handleSubmit = async () => {
    if (!validate()) return

    setIsLoading(true)
    
    // 실제 API 호출 대신 시뮬레이션
    setTimeout(() => {
      setIsLoading(false)
      setShowDoneSheet(true)
    }, 600)
  }

  // 완료 시트 확인
  const handleSheetOk = () => {
    setShowDoneSheet(false)
    onClose()
  }

  // 버튼 활성화 상태는 useEffect에서 관리됨

  return (
    <div className="settlement-screen">
      <header className="settlement-header">
        <button className="back-button" onClick={onClose}>←</button>
        <div className="title">정산 신청</div>
        <span>⋯</span>
      </header>

      <main className="container">
        {/* 정산 요약 */}
        <section className="card" id="summary">
          <div className="card-title">정산 요약</div>
          <div className="row">
            <span className="label">정산 가능 캐시백</span>
            <span className="value">{availableCashback.toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">지급 예정 캐시백</span>
            <span className="value">{scheduledCashback.toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">다음 지급일</span>
            <span className="value">{payoutDate}</span>
          </div>
          <div className="hint">최소 정산액 1,000원이에요.</div>
        </section>

        {/* 정산 금액 선택 */}
        <section className="card">
          <div className="card-title">정산 금액</div>

          {availableCashback > 0 ? (
            <>
              <label className="radio">
                <input 
                  type="radio" 
                  name="mode" 
                  value="all" 
                  checked={mode === 'all'}
                  onChange={() => setMode('all')}
                />
                <span>전체 정산하기</span>
              </label>

              <label className="radio">
                <input 
                  type="radio" 
                  name="mode" 
                  value="partial" 
                  checked={mode === 'partial'}
                  onChange={() => setMode('partial')}
                />
                <span>일부만 정산하기</span>
              </label>

              <div className="input-wrap">
                <input 
                  className="input" 
                  type="tel" 
                  inputMode="numeric" 
                  placeholder="정산할 금액을 입력해요"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={mode === 'all'}
                />
                <span className="unit">원</span>
              </div>
              {errorMessage && <div className="err">{errorMessage}</div>}
            </>
          ) : (
            <div className="no-cashback-message">
              <p>정산할 캐시백이 없어요.</p>
              <p className="hint">캐시백을 적립한 후 다시 시도해 주세요.</p>
            </div>
          )}
        </section>

        {/* 지급 수단 (토스 포인트 고정) */}
        <section className="card" id="payment-method-card">
          <div className="card-title">지급 수단</div>
          <div className="list">
            <div>
              <div style={{ fontWeight: 800 }}>토스 포인트로 지급</div>
              <div className="hint" style={{ margin: '4px 0 0' }}>신청 금액만큼 포인트로 들어와요.</div>
            </div>
            <span className="badge">고정</span>
          </div>
        </section>


      </main>

      {/* 하단 CTA */}
      {availableCashback > 0 && (
        <div className="bottom">
          <button 
            className={`btn ${isButtonActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={!isButtonActive || isLoading}
          >
            정산 신청하기
          </button>
        </div>
      )}

      {/* 완료 시트 */}
      {showDoneSheet && (
        <div className="sheet show" aria-modal="true" role="dialog">
          <div className="bar"></div>
          <div className="tit">정산 신청을 완료했어요</div>
          <div className="rows">
            <div className="row">
              <span className="label">신청 금액</span> 
              <span className="value">{getAmountToSettle().toLocaleString()}원</span>
            </div>
            <div className="row">
              <span className="label">지급 수단</span> 
              <span className="value">토스 포인트</span>
            </div>
            <div className="row">
              <span className="label">지급 예정일</span> 
              <span className="value">{payoutDate}</span>
            </div>
          </div>
          <button className="ok" onClick={handleSheetOk}>확인</button>
        </div>
      )}
    </div>
  )
}

export default SettlementScreen
