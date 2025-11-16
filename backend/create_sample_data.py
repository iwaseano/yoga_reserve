"""
Sample data insertion script for yoga reservation system
"""

from datetime import date, time, timedelta
from app.db.database import SessionLocal
from app.models.models import Service, Slot


def create_sample_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_services = db.query(Service).count()
        if existing_services > 0:
            print(f"Sample data already exists ({existing_services} services found)")
            return

        # Create services
        services = [
            Service(
                name="ヨガ基礎",
                description="初心者向けの基本的なヨガクラス。呼吸法と基本ポーズを学びます。",
                duration=60,
            ),
            Service(
                name="パワーヨガ",
                description="体力向上とシェイプアップを目指す活動的なヨガクラス。",
                duration=75,
            ),
            Service(
                name="リラックスヨガ",
                description="ストレス解消と心身のリラクゼーションを目的としたクラス。",
                duration=60,
            ),
            Service(
                name="モーニングヨガ",
                description="朝の目覚めをサポートする爽やかなヨガクラス。",
                duration=45,
            ),
        ]

        db.add_all(services)
        db.commit()
        print(f"Created {len(services)} services")

        # Refresh to get IDs
        for service in services:
            db.refresh(service)

        # Create slots for the next 7 days
        today = date.today()
        slots = []

        # Time slots: 9:00, 11:00, 14:00, 16:00, 18:00
        time_slots = [
            time(9, 0),
            time(11, 0),
            time(14, 0),
            time(16, 0),
            time(18, 0),
        ]

        for day_offset in range(7):
            slot_date = today + timedelta(days=day_offset)

            for service in services:
                # Morning Yoga only in the morning
                if service.name == "モーニングヨガ":
                    slots.append(
                        Slot(
                            service_id=service.id,
                            date=slot_date,
                            start_time=time(7, 0),
                            capacity=15,
                        )
                    )
                else:
                    # Other services at regular time slots
                    for start_time in time_slots:
                        slots.append(
                            Slot(
                                service_id=service.id,
                                date=slot_date,
                                start_time=start_time,
                                capacity=10 if service.name == "パワーヨガ" else 12,
                            )
                        )

        db.add_all(slots)
        db.commit()
        print(f"Created {len(slots)} time slots")
        print(f"Sample data creation completed successfully!")

    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()
