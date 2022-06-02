import * as React from "react";
import Spinner, { SpinnerProps } from "../Spinner/Spinner";

export interface PanelSpinnerProps extends SpinnerProps {
  height?: number;
}

/**
 * @see https://vkcom.github.io/VKUI/#/PanelSpinner
 */
const PanelSpinner: React.FunctionComponent<PanelSpinnerProps> = ({
  height,
  style,
  ...restProps
}: PanelSpinnerProps) => {
  return <Spinner size="regular" {...restProps} style={{ height, ...style }} />;
};

PanelSpinner.defaultProps = {
  height: 96,
};

// eslint-disable-next-line import/no-default-export
export default React.memo(PanelSpinner);
