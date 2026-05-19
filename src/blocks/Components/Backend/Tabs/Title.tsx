import type { ComponentType } from "react";

interface TitleProps {
  Icon?: ComponentType<{ size?: number }>;
  title: string;
  badgeText?: string;
}

const Title = ({ Icon, title, badgeText = "" }: TitleProps) => {
  return (
    <div className="h5vp-panel-icon">
      {Icon ? <Icon size={16} /> : ""} {title}
      {badgeText ? <span className="h5vp-panel-pro-badge">{badgeText}</span> : ""}
    </div>
  );
};

export default Title;
