import { forwardRef, type ReactNode } from "react";
import { PanelBody } from "@wordpress/components";
import { videoIcon2 } from "../../../icons/VideoIcon";

interface CustomPanelBodyProps {
  children: ReactNode;
  title: string;
  badgeText?: string | null;
  isIcon?: boolean;
  iconStyle?: Record<string, string>;
  className?: string;
  [key: string]: any;
}

const CustomPanelBody = forwardRef<HTMLDivElement, CustomPanelBodyProps>(
  ({ children, title, badgeText = "PRO", isIcon = true, iconStyle = { color: "#146ef5" }, className = "", ...restProps }, ref) => {
    return (
      <PanelBody
        ref={ref}
        title={
          <div className="h5vp-panel-icon">
            {isIcon ? videoIcon2(iconStyle) : ""} {title}
            {badgeText ? <span className="h5vp-panel-pro-badge">{badgeText}</span> : ""}
          </div> as unknown as string
        }
        {...restProps}
        className={`bPlPanelBody ${className}`}
      >
        {children}
      </PanelBody>
    );
  }
);

CustomPanelBody.displayName = "CustomPanelBody";

export default CustomPanelBody;
