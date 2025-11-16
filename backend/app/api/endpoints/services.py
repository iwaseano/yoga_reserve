from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, time
from app.db.database import get_db
from app.schemas.schemas import ServiceResponse, SlotsResponse, SlotInfo
from app.models.models import Service, Slot, Booking, BookingStatus
from app.api.deps import get_current_user
from app.models.models import User

router = APIRouter()


@router.get("", response_model=list[ServiceResponse])
def get_services(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """サービス一覧取得"""
    services = db.query(Service).all()
    return services


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """サービス詳細取得"""
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    return service


@router.get("/{service_id}/slots", response_model=SlotsResponse)
def get_service_slots(
    service_id: int,
    date_param: str = Query(..., alias="date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """サービスの予約可能枠取得"""
    # サービスの存在確認
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    # 日付をパース
    try:
        target_date = datetime.strptime(date_param, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD",
        )

    # 指定日のスロットを取得
    slots = (
        db.query(Slot)
        .filter(Slot.service_id == service_id, Slot.date == target_date)
        .order_by(Slot.start_time)
        .all()
    )

    # 各スロットの予約状況を計算
    slot_infos = []
    for slot in slots:
        # このスロットの予約数を取得（キャンセルされていないもの）
        reserved_count = (
            db.query(func.count(Booking.id))
            .filter(
                Booking.slot_id == slot.id, Booking.status == BookingStatus.confirmed
            )
            .scalar()
        )

        available = slot.capacity - reserved_count

        slot_infos.append(
            SlotInfo(
                id=slot.id,
                start_time=slot.start_time.strftime("%H:%M"),
                capacity=slot.capacity,
                reserved=reserved_count,
                available=available,
            )
        )

    return SlotsResponse(service_id=service_id, date=date_param, slots=slot_infos)
