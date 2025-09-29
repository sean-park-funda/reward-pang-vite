import React, { useState } from 'react'
import SettlementScreen from './SettlementScreen'

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

interface CashbackData {
  totalCashback: number
  paidCashback: number
  confirmedCashback: number
  nextPaymentDate: string
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

interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_number: string
  account_holder: string
  created_at: string
  updated_at: string
}

interface CashbackTabProps {
  cashbackData: CashbackData
  groupPurchases: GroupPurchase[]
  settlements: Settlement[]
  bankAccount: BankAccount | null
  userGroupId: string
  accessToken: string
  onSettlementCreated?: (settlement: Settlement) => void
}

const CashbackTab: React.FC<CashbackTabProps> = ({ 
  cashbackData, 
  groupPurchases, 
  settlements, 
  bankAccount, 
  userGroupId, 
  accessToken, 
  onSettlementCreated 
}) => {
  const [showSettlement, setShowSettlement] = useState(false)
  const [showConfirmedCashbackPopup, setShowConfirmedCashbackPopup] = useState(false)
  
  // groupPurchases가 undefined이거나 빈 배열일 때 처리
  const safeGroupPurchases = groupPurchases || []
  
  console.log('CashbackTab - safeGroupPurchases:', safeGroupPurchases)
  
  // 확정 캐시백 계산 함수
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
    return safeGroupPurchases.reduce((total, purchase) => {
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
  
  // 상품명 마스킹 함수
  const maskProductName = (productName: string) => {
    if (productName.length <= 1) {
      return productName
    }
    if (productName.length <= 3) {
      return productName.substring(0, productName.length - 1) + '*'
    }
    const starsCount = Math.min(productName.length - 3, 10) // 최대 10개까지만
    return productName.substring(0, 3) + '*'.repeat(starsCount)
  }
  
  // 월별로 구매 내역을 그룹화
  const groupPurchasesByMonth = safeGroupPurchases.reduce((acc, purchase) => {
    const date = new Date(purchase.purchase_date)
    const monthKey = `${date.getFullYear()}년 ${date.getMonth() + 1}월`
    
    console.log('Processing purchase:', purchase.product_name, 'date:', purchase.purchase_date, 'monthKey:', monthKey)
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        purchases: [],
        totalReward: 0
      }
    }
    
    acc[monthKey].purchases.push(purchase)
    acc[monthKey].totalReward += purchase.reward_amount
    
    return acc
  }, {} as Record<string, { month: string; purchases: GroupPurchase[]; totalReward: number }>)

  // 월별로 정렬 (최신순)
  const sortedMonths = Object.values(groupPurchasesByMonth).sort((a, b) => {
    const dateA = new Date(a.purchases[0]?.purchase_date || '')
    const dateB = new Date(b.purchases[0]?.purchase_date || '')
    return dateB.getTime() - dateA.getTime()
  })
  
  console.log('CashbackTab - groupPurchasesByMonth:', groupPurchasesByMonth)
  console.log('CashbackTab - sortedMonths:', sortedMonths)

  return (
    <>
      {showSettlement ? (
        <SettlementScreen 
          cashbackData={cashbackData}
          settlements={settlements}
          bankAccount={bankAccount}
          groupPurchases={safeGroupPurchases}
          userGroupId={userGroupId}
          accessToken={accessToken}
          onClose={() => setShowSettlement(false)}
          onSettlementCreated={onSettlementCreated}
        />
      ) : (
        <div className="tab-panel">
          {/* 상단 요약 카드 */}
          <div className="card cashback-card">
            <div className="card-title">캐시백 요약</div>
            <div className="card-item">
              <div className="card-label">누적 캐시백</div>
              <div className="card-value">{cashbackData.totalCashback.toLocaleString()}원</div>
            </div>
            <div className="card-item">
              <div className="card-label">
                확정 캐시백
                <button 
                  className="help-button"
                  onClick={() => setShowConfirmedCashbackPopup(true)}
                  title="확정 캐시백 설명"
                >
                  ?
                </button>
              </div>
              <div className="card-value">{calculateConfirmedCashback().toLocaleString()}원</div>
            </div>
            <div className="card-item">
              <div className="card-label">지급된 캐시백</div>
              <div className="card-value">{cashbackData.paidCashback.toLocaleString()}원</div>
            </div>
            <button 
              className="settlement-button"
              onClick={() => setShowSettlement(true)}
            >
              정산 신청하기
            </button>
          </div>

          {/* 월별 적립 내역 */}
          {sortedMonths.map((monthData) => (
            <div key={monthData.month} className="month-section">
              <div className="month-title">
                {monthData.month} (총 {monthData.totalReward.toLocaleString()}원)
              </div>
              <div className="transaction-list">
                {monthData.purchases.map((purchase) => {
                  return (
                    <div key={purchase.id} className="transaction-item">
                      {/* <div className="transaction-date">{formattedDate}</div> */}
                      <div className="transaction-name">
                        {purchase.exact_purchase_date ? 'T' : 'F'} {maskProductName(purchase.product_name)}
                      </div>
                      <div className="transaction-details">
                        결제액: {purchase.purchase_amount.toLocaleString()}원 | 캐시백: {purchase.reward_amount.toLocaleString()}원
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

        </div>
      )}
      
      {/* 확정 캐시백 설명 팝업 */}
      {showConfirmedCashbackPopup && (
        <div className="popup-overlay" onClick={() => setShowConfirmedCashbackPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>확정 캐시백이란?</h3>
              <button 
                className="popup-close"
                onClick={() => setShowConfirmedCashbackPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              <p>확정된 캐시백만 정산 신청이 가능합니다.</p>
              <p>캐시백은 매월 8일에 확정되며, 현재 시점에 따라 다음과 같이 계산됩니다:</p>
              <ul>
                <li><strong>매월 1~7일:</strong> 전전월까지의 누적 캐시백</li>
                <li><strong>매월 8일 이후:</strong> 전월까지의 누적 캐시백</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CashbackTab
