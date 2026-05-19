import { Icon, ToggleControl, Tooltip } from "@wordpress/components";

interface BToggleControlProps {
  info?: string;
  label?: string;
  className?: string;
  onChange?: (val: any) => void;
  Component?: React.ElementType;
  [key: string]: any;
}

const BToggleControl = ({ info = "", label = "", className = "", onChange = () => { }, Component = ToggleControl, ...restProps }: BToggleControlProps) => {
  return (
    <div className={`mt5 bToggleControl ${className}`}>
      <Component
        className={className}
        label={<Label info={info} label={label} />}
        onChange={onChange}
        {...restProps}
      />
    </div>
  );
};

export default BToggleControl;

interface LabelProps {
  info?: string;
  label?: string;
}

export const Label = ({ info = "", label = "" }: LabelProps) => {
  return (
    <>
      {label && <span style={{ marginRight: "5px" }}>{label}</span>}
      {info && (
        <Tooltip text={info} placement="top">
          <Icon icon="info-outline" size={17} />
        </Tooltip>
      )}
    </>
  );
};
