import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { context } from 'dumi/theme';
import classnames from 'classnames';
import { IPreviewerProps } from 'dumi-theme-default/src/builtins/Previewer';
import Previewer from 'dumi-theme-default/src/builtins/Previewer';
import './Previewer.scss';

export const ACTIVE_MSG_TYPE = 'dumi:scroll-into-demo';

let current = null;

export default (props: IPreviewerProps) => {
  const ref = useRef<HTMLDivElement>();
  const { meta } = useContext(context);
  const [previewerProps, setPreviewerProps] = useState<null | IPreviewerProps>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const isFirstDemo = document.querySelector('.__dumi-default-mobile-previewer') === ref.current;

    if (isFirstDemo && isActive === false) {
      setIsActive(true);

      current = props.identifier;

      window.postMessage(
        {
          type: ACTIVE_MSG_TYPE,
          value: JSON.stringify({
            identifier: props.identifier,
            demoUrl: props.demoUrl,
          }),
        },
        '*',
      );
    }

    /* istanbul ignore next */
    if (
      typeof meta.title === 'string' &&
      window?.outerWidth > 960 &&
      meta.mobile === true
    ) {
      // rewrite props for device mode
      setPreviewerProps(
        Object.assign({}, props, {
          // omit iframe
          iframe: null,
          // omit children
          children: null,
          // show source code
          defaultShowCode: true,
          // hide external action
          hideActions: ['EXTERNAL' as IPreviewerProps['hideActions'][0]].concat(
            props.hideActions,
          ),
        }),
      );
    } else {
      // use standard mode if screen min than 960px
      setPreviewerProps(props);
    }
  }, [props, meta]);

  const onClick = useCallback(() => {
    setIsActive(true);

    current = props.identifier;

    window.postMessage(
      {
        type: ACTIVE_MSG_TYPE,
        value: JSON.stringify({
          identifier: props.identifier,
          demoUrl: props.demoUrl,
        }),
      },
      '*',
    );
  }, [props]);

  return (
    <div
      className={classnames([
        '__dumi-default-mobile-previewer',
        meta.mobile === true ? '__dumi-default-previewer-target' : null,
        isActive && current === props.identifier ? 'preview-actived' : null,
      ])}
      ref={ref}
      onClick={onClick}
    >
      {previewerProps && <Previewer {...previewerProps} defaultShowCode />}
    </div>
  );
};
