from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from sqlalchemy.sql import func

from database import Base


class SearchHistory(Base):

    __tablename__ = "history"

    id = Column(Integer, primary_key=True)

    product_name = Column(String(500))

    recommendation = Column(Text)

    youtube_links = Column(Text)

    news_analysis = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )