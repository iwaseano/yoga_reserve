import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { BookingDetail } from '../types';
import { ToastType } from './Toast';

interface MyBookingsProps {
  onBack: () => void;
  refreshTrigger: number;
  showToast: (message: string, type: ToastType) => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ onBack, refreshTrigger, showToast }) => {
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [cancelModal, setCancelModal] = useState<{
    show: boolean;
    booking: BookingDetail | null;
  }>({ show: false, booking: null });

  useEffect(() => {
    loadBookings();
  }, [refreshTrigger]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('予約一覧取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (booking: BookingDetail) => {
    setCancelModal({ show: true, booking });
  };

  const confirmCancel = async () => {
    if (!cancelModal.booking) return;

    setCancelling(cancelModal.booking.id);
    try {
      await api.cancelBooking(cancelModal.booking.id);
      setCancelModal({ show: false, booking: null });
      showToast('予約をキャンセルしました', 'success');
      loadBookings();
    } catch (error) {
      console.error('キャンセルエラー:', error);
      showToast('キャンセルに失敗しました', 'error');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="my-bookings">
      <div className="booking-header">
        <button className="btn-back" onClick={onBack}>
          ← 戻る
        </button>
        <h2>📅 予約一覧</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>予約はありません</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-info">
                <h3>{booking.service_name}</h3>
                <p className="booking-datetime">
                  📆 {formatDate(booking.date)} {booking.start_time}
                </p>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status === 'confirmed' ? '予約済み' : 'キャンセル済み'}
                </span>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(booking)}
                  disabled={cancelling === booking.id}
                >
                  {cancelling === booking.id ? 'キャンセル中...' : 'キャンセル'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* キャンセル確認モーダル */}
      {cancelModal.show && cancelModal.booking && (
        <div className="modal-overlay" onClick={() => setCancelModal({ show: false, booking: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCancelModal({ show: false, booking: null })}>
              ✕
            </button>
            <h2 className="modal-title">予約キャンセル確認</h2>
            <div className="confirm-details">
              <div className="confirm-row">
                <span className="confirm-label">ユーザー名:</span>
                <span className="confirm-value">{JSON.parse(localStorage.getItem('user') || '{}').name}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">レッスン:</span>
                <span className="confirm-value">{cancelModal.booking.service_name}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">日付:</span>
                <span className="confirm-value">{formatDate(cancelModal.booking.date)}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">時間:</span>
                <span className="confirm-value">{cancelModal.booking.start_time}</span>
              </div>
            </div>
            <p className="cancel-warning">この予約をキャンセルしてもよろしいですか?</p>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel" 
                onClick={() => setCancelModal({ show: false, booking: null })}
              >
                戻る
              </button>
              <button 
                className="btn-modal-confirm btn-danger" 
                onClick={confirmCancel}
                disabled={cancelling !== null}
              >
                {cancelling !== null ? 'キャンセル中...' : 'キャンセルを確定する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
