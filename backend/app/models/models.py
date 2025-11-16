from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Time, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base


class BookingStatus(str, enum.Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "yoga_reserve"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user")


class Service(Base):
    __tablename__ = "services"
    __table_args__ = {"schema": "yoga_reserve"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    duration = Column(Integer, nullable=False)  # 分単位
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="service")
    slots = relationship("Slot", back_populates="service")


class Slot(Base):
    __tablename__ = "slots"
    __table_args__ = {"schema": "yoga_reserve"}

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("yoga_reserve.services.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    capacity = Column(Integer, nullable=False, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)

    service = relationship("Service", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = {"schema": "yoga_reserve"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("yoga_reserve.users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("yoga_reserve.services.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("yoga_reserve.slots.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    status = Column(
        Enum(BookingStatus), default=BookingStatus.confirmed, nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    slot = relationship("Slot", back_populates="bookings")
