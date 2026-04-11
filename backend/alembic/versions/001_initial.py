"""Initial migration — create weather_records table

Revision ID: 001
Revises: 
Create Date: 2026-04-12 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'weather_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('feels_like', sa.Float(), nullable=True),
        sa.Column('humidity', sa.Integer(), nullable=True),
        sa.Column('wind_speed', sa.Float(), nullable=True),
        sa.Column('weather_condition', sa.String(), nullable=True),
        sa.Column('weather_icon', sa.String(), nullable=True),
        sa.Column('ai_summary', sa.String(), nullable=True),
        sa.Column('raw_data', sa.JSON(), nullable=True),
        sa.Column('queried_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_weather_records_id'), 'weather_records', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_weather_records_id'), table_name='weather_records')
    op.drop_table('weather_records')
