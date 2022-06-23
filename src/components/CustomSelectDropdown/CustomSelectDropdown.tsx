import * as React from "react";
import { CustomScrollView } from "../CustomScrollView/CustomScrollView";
import { classNames } from "../../lib/classNames";
import { useIsomorphicLayoutEffect } from "../../lib/useIsomorphicLayoutEffect";
import { Popper, Placement } from "../Popper/Popper";
import { Spinner } from "../Spinner/Spinner";
import { HasRef } from "../../types";
import "./CustomSelectDropdown.css";

export interface CustomSelectDropdownProps
  extends React.HTMLAttributes<HTMLElement>,
    HasRef<HTMLDivElement> {
  targetRef: React.RefObject<HTMLElement>;
  placement?: Placement;
  scrollBoxRef?: React.RefObject<HTMLDivElement>;
  fetching?: boolean;
  offsetDistance?: number;
  sameWidth?: boolean;
  forcePortal?: boolean;
  onPlacementChange?: (placement?: Placement) => void;
}

interface PlacementDependencies {
  height: number | undefined;
}

const calcIsTop = (placement?: Placement) => placement?.includes("top");

export const CustomSelectDropdown: React.FC<CustomSelectDropdownProps> = ({
  children,
  targetRef,
  scrollBoxRef,
  placement,
  fetching,
  onPlacementChange: parentOnPlacementChange,
  offsetDistance = 0,
  sameWidth = true,
  forcePortal = true,
  ...restProps
}) => {
  const [isTop, setIsTop] = React.useState(() => calcIsTop(placement));
  const [placementDependencies, setPlacementDependencies] =
    React.useState<PlacementDependencies>();
  const scrollBoxHeight = React.useRef<number>();

  const onPlacementChange = React.useCallback(
    ({ placement }: { placement?: Placement }) => {
      setIsTop(calcIsTop(placement));
      parentOnPlacementChange?.(placement);
    },
    [parentOnPlacementChange, setIsTop]
  );

  useIsomorphicLayoutEffect(() => {
    if (scrollBoxHeight.current !== scrollBoxRef?.current?.clientHeight) {
      const computedHeight = scrollBoxRef?.current?.clientHeight;
      if (scrollBoxHeight.current !== undefined) {
        setPlacementDependencies({ height: computedHeight });
      }
      scrollBoxHeight.current = computedHeight;
    }
  });

  return (
    <Popper
      targetRef={targetRef}
      offsetDistance={offsetDistance}
      sameWidth={sameWidth}
      onPlacementChange={onPlacementChange}
      placement={placement}
      vkuiClass={classNames(
        "CustomSelectDropdown",
        offsetDistance === 0 &&
          (isTop
            ? "CustomSelectDropdown--top"
            : "CustomSelectDropdown--bottom"),
        sameWidth && "CustomSelectDropdown--wide"
      )}
      forcePortal={forcePortal}
      placementDependencies={placementDependencies}
      {...restProps}
    >
      <CustomScrollView
        boxRef={scrollBoxRef}
        vkuiClass="CustomSelectDropdown__in"
      >
        {fetching ? (
          <div vkuiClass="CustomSelectDropdown__fetching">
            <Spinner size="small" />
          </div>
        ) : (
          children
        )}
      </CustomScrollView>
    </Popper>
  );
};
