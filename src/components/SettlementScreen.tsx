import React, { useState, useEffect } from 'react'
import { getApiUrl } from '../utils/apiConfig'
import './SettlementScreen.css'

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

interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_number: string
  account_holder: string
  created_at: string
  updated_at: string
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

interface CreateSettlementRequest {
  amount: number
  bank_account_number: string
  bank_name: string
  account_holder: string
  user_group_id: string
}

interface CreateSettlementResponse {
  success: boolean
  data: {
    settlement: Settlement
    message: string
  }
}

interface SettlementScreenProps {
  cashbackData: {
    totalCashback: number
    paidCashback: number
    confirmedCashback: number
    nextPaymentDate: string
  }
  settlements: Settlement[]
  bankAccount: BankAccount | null
  groupPurchases: GroupPurchase[]
  userGroupId: string
  accessToken: string
  onClose: () => void
  onSettlementCreated?: (settlement: Settlement) => void
}

const SettlementScreen: React.FC<SettlementScreenProps> = ({ 
  cashbackData, 
  settlements, 
  bankAccount, 
  groupPurchases, 
  userGroupId, 
  accessToken, 
  onClose, 
  onSettlementCreated 
}) => {
  const [showDoneSheet, setShowDoneSheet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)

  // 확정 캐시백 계산 (8일 기준으로 전달/전전달 구분)
  const calculateConfirmedCashback = () => {
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // 8일 기준으로 전달/전전달 구분
    let targetMonth, targetYear
    if (currentDay >= 8) {
      // 오늘이 8일 이후라면 전달까지의 누적 캐시백
      targetMonth = currentMonth - 1
      targetYear = currentYear
      if (targetMonth < 0) {
        targetMonth = 11
        targetYear = currentYear - 1
      }
    } else {
      // 오늘이 8일 이전이라면 전전달까지의 누적 캐시백
      targetMonth = currentMonth - 2
      targetYear = currentYear
      if (targetMonth < 0) {
        targetMonth = 10
        targetYear = currentYear - 1
      }
    }
    
    // 해당 월까지의 누적 캐시백 계산
    return groupPurchases.reduce((total, purchase) => {
      const purchaseDate = new Date(purchase.purchase_date)
      const purchaseMonth = purchaseDate.getMonth()
      const purchaseYear = purchaseDate.getFullYear()
      
      // 목표 월 이전의 구매 내역만 포함
      if (purchaseYear < targetYear || (purchaseYear === targetYear && purchaseMonth <= targetMonth)) {
        return total + purchase.reward_amount
      }
      return total
    }, 0)
  }

  // 지급완료 금액 계산
  const calculatePaidAmount = () => {
    return settlements
      .filter(settlement => settlement.status === 'completed')
      .reduce((total, settlement) => total + settlement.settlement_amount, 0)
  }

  // 신청중 금액 계산
  const calculatePendingAmount = () => {
    return settlements
      .filter(settlement => settlement.status === 'pending')
      .reduce((total, settlement) => total + settlement.settlement_amount, 0)
  }

  // 신청가능 캐시백 계산 (확정 캐시백 - 신청중/지급완료 금액)
  const calculateAvailableCashback = () => {
    const confirmedCashback = calculateConfirmedCashback()
    const requestedAmount = settlements
      .filter(settlement => settlement.status === 'pending' || settlement.status === 'completed')
      .reduce((total, settlement) => total + settlement.settlement_amount, 0)
    
    return Math.max(0, confirmedCashback - requestedAmount)
  }

  const confirmedCashback = calculateConfirmedCashback()
  const availableCashback = calculateAvailableCashback()
  const payoutDate = cashbackData.nextPaymentDate || '2024.12.31'

  // 정산할 금액 계산 (항상 전체 정산)
  const getAmountToSettle = () => {
    return availableCashback
  }

  // 유효성 검사 (10,000원 이상일 때만 신청 가능)
  const validate = () => {
    return availableCashback >= 10000
  }

  // 상태 변경 시 유효성 검사 실행
  useEffect(() => {
    const isValid = availableCashback >= 10000
    setIsButtonActive(isValid)
  }, [availableCashback])

  // 정산 신청 API 호출
  const createSettlement = async (requestData: CreateSettlementRequest): Promise<CreateSettlementResponse> => {
    const response = await fetch(getApiUrl('/api/settlements/create'), {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // 제출 처리
  const handleSubmit = async () => {
    if (!validate() || !bankAccount) return

    setIsLoading(true)
    
    try {
      const requestData: CreateSettlementRequest = {
        amount: availableCashback,
        bank_account_number: bankAccount.account_number,
        bank_name: bankAccount.bank_name,
        account_holder: bankAccount.account_holder,
        user_group_id: userGroupId
      }

      const response = await createSettlement(requestData)
      
      if (response.success) {
        // 성공 시 콜백 호출하여 상위 컴포넌트에 새 정산 정보 전달
        if (onSettlementCreated) {
          onSettlementCreated(response.data.settlement)
        }
        setShowDoneSheet(true)
      } else {
        throw new Error('정산 신청에 실패했습니다.')
      }
    } catch (error) {
      console.error('정산 신청 실패:', error)
      alert(`정산 신청에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 완료 시트 확인
  const handleSheetOk = () => {
    setShowDoneSheet(false)
    onClose()
  }

  // 정산 기록을 날짜순으로 정렬 (최신순)
  const sortedSettlements = [...settlements].sort((a, b) => 
    new Date(b.application_date).getTime() - new Date(a.application_date).getTime()
  )

  // 상태별 텍스트와 스타일
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '대기중', className: 'status-pending' }
      case 'completed':
        return { text: '완료', className: 'status-completed' }
      case 'rejected':
        return { text: '거절', className: 'status-rejected' }
      default:
        return { text: '알 수 없음', className: 'status-unknown' }
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
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
        {/* 정산 계좌 */}
        <section className="card" id="settlement-account-card">
          <div className="card-title">정산 계좌</div>
          {bankAccount ? (
            <div className="compact-account-info">
              {bankAccount.bank_name} {bankAccount.account_number} {bankAccount.account_holder}
            </div>
          ) : (
            <div className="no-account-section">
              <div className="no-account-message">등록된 계좌가 없습니다</div>
              <button className="register-account-btn">계좌 등록하기</button>
            </div>
          )}
        </section>

        {/* 정산 요약 */}
        <section className="card" id="summary">
          <div className="card-title">정산 요약</div>
          <div className="row">
            <span className="label">누적 캐시백 (현재)</span>
            <span className="value">{cashbackData.totalCashback.toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">확정 캐시백 (현재)</span>
            <span className="value">{confirmedCashback.toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">지급완료</span>
            <span className="value">{calculatePaidAmount().toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">신청중</span>
            <span className="value">{calculatePendingAmount().toLocaleString()}원</span>
          </div>
          <div className="row">
            <span className="label">신청가능 캐시백 (현재)</span>
            <span className="value">{availableCashback.toLocaleString()}원</span>
          </div>
          <div className="hint">최소 정산액 10,000원이에요.</div>
        </section>

        {/* 정산 기록 */}
        {settlements.length > 0 && (
          <section className="card settlement-history-section" id="settlement-history">
            <div className="card-title">정산 기록</div>
            <div className="settlement-list">
              {sortedSettlements.map((settlement) => {
                const statusInfo = getStatusInfo(settlement.status)
                return (
                  <div key={settlement.id} className="settlement-item">
                    <div className="settlement-header">
                      <div className="settlement-amount">
                        {settlement.settlement_amount.toLocaleString()}원
                      </div>
                      <div className={`settlement-status ${statusInfo.className}`}>
                        {statusInfo.text}
                      </div>
                    </div>
                    <div className="settlement-details">
                      <div className="settlement-date">
                        신청일: {formatDate(settlement.application_date)}
                      </div>
                      {settlement.settlement_date && (
                        <div className="settlement-date">
                          지급일: {formatDate(settlement.settlement_date)}
                        </div>
                      )}
                      <div className="settlement-account">
                        계좌: {settlement.bank_account_number}
                        {bankAccount && settlement.bank_account_number === bankAccount.account_number && (
                          <span className="current-account-badge"> (현재 계좌)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}


      </main>

      {/* 하단 CTA */}
      {availableCashback >= 10000 ? (
        <div className="bottom">
          <button 
            className={`btn ${isButtonActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={!isButtonActive || isLoading}
          >
            정산 신청하기
          </button>
        </div>
      ) : availableCashback > 0 ? (
        <div className="bottom">
          <div className="insufficient-amount-message">
            <p>정산 신청은 10,000원 이상부터 가능해요.</p>
            <p className="hint">현재 신청가능 캐시백: {availableCashback.toLocaleString()}원</p>
          </div>
        </div>
      ) : null}

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
