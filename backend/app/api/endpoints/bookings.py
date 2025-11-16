from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.db.database import get_db
from app.schemas.schemas import (
    BookingCreate,
    BookingResponse,
    BookingDetail,
    BookingCancelResponse,
)
from app.models.models import Booking, Service, Slot, BookingStatus, User
from app.api.deps import get_current_user

router = APIRouter()


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """予約作成"""
    # 日付と時刻をパース
    try:
        booking_date = datetime.strptime(booking_data.date, "%Y-%m-%d").date()
        booking_time = datetime.strptime(booking_data.start_time, "%H:%M").time()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date or time format",
        )

    # サービスの存在確認
    service = db.query(Service).filter(Service.id == booking_data.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    # スロットの存在確認
    slot = (
        db.query(Slot)
        .filter(
            Slot.service_id == booking_data.service_id,
            Slot.date == booking_date,
            Slot.start_time == booking_time,
        )
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
        )

    # 空き状況の確認
    reserved_count = (
        db.query(func.count(Booking.id))
        .filter(Booking.slot_id == slot.id, Booking.status == BookingStatus.confirmed)
        .scalar()
    )

    if reserved_count >= slot.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Slot is full"
        )

    # 予約作成
    new_booking = Booking(
        user_id=current_user.id,
        service_id=booking_data.service_id,
        slot_id=slot.id,
        date=booking_date,
        start_time=booking_time,
        status=BookingStatus.confirmed,
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return BookingResponse(
        booking_id=new_booking.id,
        status=new_booking.status.value,
        service_id=new_booking.service_id,
        date=booking_data.date,
        start_time=booking_data.start_time,
    )


@router.get("/mine", response_model=list[BookingDetail])
def get_my_bookings(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """自分の予約一覧取得"""
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.date.desc(), Booking.start_time.desc())
        .all()
    )

    result = []
    for booking in bookings:
        result.append(
            BookingDetail(
                id=booking.id,
                service_id=booking.service_id,
                service_name=booking.service.name,
                date=booking.date.strftime("%Y-%m-%d"),
                start_time=booking.start_time.strftime("%H:%M"),
                status=booking.status.value,
            )
        )

    return result


@router.delete("/{booking_id}", response_model=BookingCancelResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """予約キャンセル"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    # 自分の予約か確認
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking",
        )

    # すでにキャンセル済みか確認
    if booking.status == BookingStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Booking already cancelled"
        )

    # キャンセル処理
    booking.status = BookingStatus.cancelled
    db.commit()

    return BookingCancelResponse(id=booking.id, status=booking.status.value)
