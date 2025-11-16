"""create initial schema and tables

Revision ID: 001
Revises:
Create Date: 2025-01-10 12:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create schema
    op.execute("CREATE SCHEMA IF NOT EXISTS yoga_reserve")

    # Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema="yoga_reserve",
    )
    op.create_index("ix_yoga_reserve_users_id", "users", ["id"], schema="yoga_reserve")
    op.create_index(
        "ix_yoga_reserve_users_email",
        "users",
        ["email"],
        unique=True,
        schema="yoga_reserve",
    )

    # Create services table
    op.create_table(
        "services",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema="yoga_reserve",
    )
    op.create_index(
        "ix_yoga_reserve_services_id", "services", ["id"], schema="yoga_reserve"
    )

    # Create slots table
    op.create_table(
        "slots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["yoga_reserve.services.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="yoga_reserve",
    )
    op.create_index("ix_yoga_reserve_slots_id", "slots", ["id"], schema="yoga_reserve")

    # Create bookings table
    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.Column("slot_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("confirmed", "cancelled", name="bookingstatus"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["yoga_reserve.services.id"],
        ),
        sa.ForeignKeyConstraint(
            ["slot_id"],
            ["yoga_reserve.slots.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["yoga_reserve.users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="yoga_reserve",
    )
    op.create_index(
        "ix_yoga_reserve_bookings_id", "bookings", ["id"], schema="yoga_reserve"
    )


def downgrade():
    op.drop_index(
        "ix_yoga_reserve_bookings_id", table_name="bookings", schema="yoga_reserve"
    )
    op.drop_table("bookings", schema="yoga_reserve")
    op.drop_index("ix_yoga_reserve_slots_id", table_name="slots", schema="yoga_reserve")
    op.drop_table("slots", schema="yoga_reserve")
    op.drop_index(
        "ix_yoga_reserve_services_id", table_name="services", schema="yoga_reserve"
    )
    op.drop_table("services", schema="yoga_reserve")
    op.drop_index(
        "ix_yoga_reserve_users_email", table_name="users", schema="yoga_reserve"
    )
    op.drop_index("ix_yoga_reserve_users_id", table_name="users", schema="yoga_reserve")
    op.drop_table("users", schema="yoga_reserve")
    op.execute("DROP TYPE IF EXISTS bookingstatus")
    op.execute("DROP SCHEMA IF EXISTS yoga_reserve CASCADE")
