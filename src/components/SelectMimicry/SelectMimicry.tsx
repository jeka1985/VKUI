import * as React from "react";
import { classNames } from "../../lib/classNames";
import { DropdownIcon } from "../DropdownIcon/DropdownIcon";
import { FormField } from "../FormField/FormField";
import { HasAlign, HasRootRef } from "../../types";
import {
  withAdaptivity,
  AdaptivityProps,
  SizeType,
} from "../../hoc/withAdaptivity";
import { usePlatform } from "../../hooks/usePlatform";
import { getClassName } from "../../helpers/getClassName";
import Headline from "../Typography/Headline/Headline";
import Text from "../Typography/Text/Text";
import { VKCOM } from "../../lib/platform";
import "../Select/Select.css";

export interface SelectMimicryProps
  extends React.HTMLAttributes<HTMLElement>,
    HasAlign,
    HasRootRef<HTMLElement>,
    AdaptivityProps {
  multiline?: boolean;
  disabled?: boolean;
  after?: React.ReactNode;
}

const SelectMimicry: React.FunctionComponent<SelectMimicryProps> = ({
  tabIndex,
  placeholder,
  children,
  align,
  getRootRef,
  multiline,
  disabled,
  onClick,
  sizeX,
  sizeY,
  after = <DropdownIcon />,
  ...restProps
}: SelectMimicryProps) => {
  const platform = usePlatform();

  const TypographyComponent =
    platform === VKCOM || sizeY === SizeType.COMPACT ? Text : Headline;

  return (
    <FormField
      {...restProps}
      tabIndex={disabled ? undefined : tabIndex}
      vkuiClass={classNames(
        getClassName("Select", platform),
        "Select--mimicry",
        {
          "Select--not-selected": !children,
          "Select--multiline": multiline,
          [`Select--align-${align}`]: !!align,
          [`Select--sizeX--${sizeX}`]: !!sizeX,
          [`Select--sizeY--${sizeY}`]: !!sizeY,
        }
      )}
      getRootRef={getRootRef}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      after={after}
    >
      <TypographyComponent
        Component="div"
        weight="regular"
        vkuiClass="Select__container"
      >
        <span vkuiClass="Select__title">{children || placeholder}</span>
      </TypographyComponent>
    </FormField>
  );
};

SelectMimicry.defaultProps = {
  tabIndex: 0,
};

// eslint-disable-next-line import/no-default-export
export default withAdaptivity(SelectMimicry, {
  sizeX: true,
  sizeY: true,
});
