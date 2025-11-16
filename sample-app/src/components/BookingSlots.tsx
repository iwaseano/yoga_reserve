import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import { Service, Slot } from '../types';
import { ToastType } from './Toast';

interface BookingSlotsProps {
  service: Service;
  onBookingComplete: () => void;
  onBack: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const BookingSlots: React.FC<BookingSlotsProps> = ({
  service,
  onBookingComplete,
  onBack,
  showToast,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    slot: Slot | null;
  }>({ show: false, slot: null });

  useEffect(() => {
    // デフォルトで明日の日付を設定
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, []);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const slots = await api.getAvailableSlots(service.id, selectedDate);
      setSlots(slots);
    } catch (error) {
      console.error('予約枠取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }, [service.id, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate, loadSlots]);

  const handleBooking = async (slot: Slot) => {
    if (slot.available === 0) return;
    setConfirmModal({ show: true, slot });
  };

  const confirmBooking = async () => {
    if (!confirmModal.slot) return;

    setBooking(true);
    try {
      await api.createBooking(
        service.id,
        confirmModal.slot.id,
        selectedDate,
        confirmModal.slot.start_time
      );
      setConfirmModal({ show: false, slot: null });
      showToast('予約が完了しました!', 'success');
      onBookingComplete();
    } catch (error) {
      console.error('予約エラー:', error);
      showToast('予約に失敗しました', 'error');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 今日以降の日付のみ選択可能にする
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-slots">
      <div className="booking-header">
        <button className="btn-back" onClick={onBack}>
          ← 戻る
        </button>
        <h2>{service.name}</h2>
      </div>

      <div className="date-selector">
        <label>予約日を選択:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
        />
      </div>

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <div className="timetable">
          <div className="timetable-header">
            <div className="time-column-header">時間</div>
            <div className="status-column-header">空き状況</div>
            <div className="action-column-header"></div>
          </div>
          {slots.map((slot) => (
            <div
              key={slot.start_time}
              className={`timetable-row ${slot.available === 0 ? 'row-full' : ''}`}
            >
              <div className="time-column">{slot.start_time}</div>
              <div className="status-column">
                <div className="availability-bar">
                  <div 
                    className="availability-fill"
                    style={{ width: `${(slot.reserved / slot.capacity) * 100}%` }}
                  ></div>
                </div>
                <span className="availability-text">
                  {slot.available === 0 ? '満員' : `空き ${slot.available}/${slot.capacity}`}
                </span>
              </div>
              <div className="action-column">
                <button
                  className="btn-book"
                  onClick={() => handleBooking(slot)}
                  disabled={slot.available === 0 || booking}
                >
                  {slot.available === 0 ? '✕ 満員' : '✓ 予約する'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 予約確認モーダル */}
      {confirmModal.show && confirmModal.slot && (
        <div className="modal-overlay" onClick={() => setConfirmModal({ show: false, slot: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setConfirmModal({ show: false, slot: null })}>
              ✕
            </button>
            <h2 className="modal-title">予約確認</h2>
            <div className="confirm-details">
              <div className="confirm-row">
                <span className="confirm-label">ユーザー名:</span>
                <span className="confirm-value">{JSON.parse(localStorage.getItem('user') || '{}').name}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">レッスン:</span>
                <span className="confirm-value">{service.name}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">日付:</span>
                <span className="confirm-value">{formatDate(selectedDate)}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">時間:</span>
                <span className="confirm-value">{confirmModal.slot.start_time}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">所要時間:</span>
                <span className="confirm-value">{service.duration}分</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel" 
                onClick={() => setConfirmModal({ show: false, slot: null })}
              >
                キャンセル
              </button>
              <button 
                className="btn-modal-confirm" 
                onClick={confirmBooking}
                disabled={booking}
              >
                {booking ? '予約中...' : '予約を確定する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSlots;
