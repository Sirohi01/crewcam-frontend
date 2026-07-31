import React from "react";

interface CardItem {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ElementType;

  iconWrapperClassName?: string;
  iconClassName?: string;

  titleClassName?: string;
  valueClassName?: string;
  subtitleClassName?: string;

  className?: string;
}

interface StatsCardsProps {
  cards: CardItem[];

  containerClassName: string;
  cardClassName: string;

  contentClassName?: string;

  iconWrapperClassName?: string;
  iconClassName?: string;

  titleClassName?: string;
  valueClassName?: string;
  subtitleClassName?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  cards,
  containerClassName,
  cardClassName,

  contentClassName = "",

  iconWrapperClassName = "",
  iconClassName = "",

  titleClassName = "",
  valueClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div className={containerClassName}>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`${cardClassName} ${card.className ?? ""}`}
          >
            {Icon && (
              <div
                className={`${
                  card.iconWrapperClassName ?? iconWrapperClassName
                }`}
              >
                <Icon
                  className={`${card.iconClassName ?? iconClassName}`}
                />
              </div>
            )}

            <div className={contentClassName}>
              <h3
                className={`${
                  card.titleClassName ?? titleClassName
                }`}
              >
                {card.title}
              </h3>

              <div
                className={`${
                  card.valueClassName ?? valueClassName
                }`}
              >
                {card.value}
              </div>

              {card.subtitle && (
                <p
                  className={`${
                    card.subtitleClassName ?? subtitleClassName
                  }`}
                >
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;