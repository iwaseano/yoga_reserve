from pydantic import BaseModel, EmailStr
from datetime import date, time
from typing import Optional


# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access: str
    refresh: str
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh: str


class RefreshResponse(BaseModel):
    access: str


# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int


class ServiceCreate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True


# Slot Schemas
class SlotInfo(BaseModel):
    id: int
    start_time: str
    capacity: int
    reserved: int
    available: int


class SlotsResponse(BaseModel):
    service_id: int
    date: str
    slots: list[SlotInfo]


# Booking Schemas
class BookingCreate(BaseModel):
    service_id: int
    slot_id: int
    date: str
    start_time: str


class BookingResponse(BaseModel):
    booking_id: int
    status: str
    service_id: int
    date: str
    start_time: str


class BookingDetail(BaseModel):
    id: int
    service_id: int
    service_name: str
    date: str
    start_time: str
    status: str

    class Config:
        from_attributes = True


class AdminBookingDetail(BookingDetail):
    user_name: str


class BookingCancelResponse(BaseModel):
    id: int
    status: str
