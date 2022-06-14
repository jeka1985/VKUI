import * as React from "react";
import { getClassName } from "../../helpers/getClassName";
import { classNames } from "../../lib/classNames";
import { withPlatform } from "../../hoc/withPlatform";
import { HasPlatform } from "../../types";
import ModalRootContext, {
  useModalRegistry,
} from "../ModalRoot/ModalRootContext";
import { ModalType } from "../ModalRoot/types";
import { getNavId, NavIdProps } from "../../lib/getNavId";
import { warnOnce } from "../../lib/warnOnce";
import {
  ModalCardBase,
  ModalCardBaseProps,
} from "../ModalCardBase/ModalCardBase";
import { useAdaptivityIsDesktop } from "../../hooks/useAdaptivity";
import "./ModalCard.css";

export interface ModalCardProps
  extends HasPlatform,
    NavIdProps,
    ModalCardBaseProps {}

const warn = warnOnce("ModalCard");

/**
 * @see https://vkcom.github.io/VKUI/#/ModalCard
 */
const ModalCard: React.FC<ModalCardProps> = (props) => {
  const {
    icon,
    header,
    subheader,
    children,
    actions,
    onClose,
    platform,
    nav,
    ...restProps
  } = props;

  const isDesktop = useAdaptivityIsDesktop();

  const modalContext = React.useContext(ModalRootContext);
  const { refs } = useModalRegistry(getNavId(props, warn), ModalType.CARD);

  return (
    <div
      {...restProps}
      // eslint-disable-next-line vkui/no-object-expression-in-arguments
      vkuiClass={classNames(getClassName("ModalCard", platform), {
        "ModalCard--desktop": isDesktop,
      })}
    >
      <ModalCardBase
        vkuiClass="ModalCard__in"
        getRootRef={refs.innerElement}
        icon={icon}
        header={header}
        subheader={subheader}
        actions={actions}
        onClose={onClose || modalContext.onClose}
      >
        {children}
      </ModalCardBase>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default withPlatform(ModalCard);
