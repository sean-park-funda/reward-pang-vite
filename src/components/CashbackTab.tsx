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
  status: string
  created_at: string
  buyer: string | null | { id: string; phone: string; isMe: boolean }
}

interface CashbackData {
  totalCashback: number
  paidCashback: number
  nextPaymentDate: string
}

interface CashbackTabProps {
  cashbackData: CashbackData
  groupPurchases: GroupPurchase[]
}

const CashbackTab: React.FC<CashbackTabProps> = ({ cashbackData, groupPurchases }) => {
  const [showSettlement, setShowSettlement] = useState(false)
  
  // groupPurchases가 undefined이거나 빈 배열일 때 처리
  const safeGroupPurchases = groupPurchases || []
  
  console.log('CashbackTab - safeGroupPurchases:', safeGroupPurchases)
  
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
          onClose={() => setShowSettlement(false)}
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
                      <div className="transaction-name">{maskProductName(purchase.product_name)}</div>
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
    </>
  )
}

export default CashbackTab
