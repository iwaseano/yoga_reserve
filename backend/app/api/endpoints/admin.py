from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import AdminBookingDetail
from app.models.models import Booking

router = APIRouter()


@router.get("/bookings", response_model=list[AdminBookingDetail])
def get_all_bookings(db: Session = Depends(get_db)):
    """全予約一覧取得（管理者用）"""
    bookings = (
        db.query(Booking).order_by(Booking.date.desc(), Booking.start_time.desc()).all()
    )

    result = []
    for booking in bookings:
        result.append(
            AdminBookingDetail(
                id=booking.id,
                service_id=booking.service_id,
                service_name=booking.service.name,
                user_name=booking.user.name,
                date=booking.date.strftime("%Y-%m-%d"),
                start_time=booking.start_time.strftime("%H:%M"),
                status=booking.status.value,
            )
        )

    return result
