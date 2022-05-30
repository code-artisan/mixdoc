import { FC } from 'react';
import React, { useState, useContext, useEffect } from 'react';
import QRCode from 'qrcode.react';
import dayjs from 'dayjs';
import { context, usePrefersColor } from 'dumi/theme';
import './index.scss';

interface IDeviceProps {
  className?: string;
  url: string;
}

const tick = (callback) => {
  callback(dayjs().format('HH:mm').toString());

  return setTimeout(() => tick(callback), 1000);
};

const Clock = () => {
  const [timerText, setTimerText] = useState('');

  useEffect(() => {
    const timer = tick((time) => setTimerText(time));

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <span>{timerText}</span>;
};

const Device: FC<IDeviceProps> = ({ url, className }) => {
  const [renderKey, setRenderKey] = useState(Math.random());
  const [color] = usePrefersColor();
  const {
    config: { mode },
  } = useContext(context);

  // re-render iframe if prefers color changed
  useEffect(() => {
    setRenderKey(Math.random());
  }, [color]);

  return (
    <div className={['__dumi-default-device'].concat(className).join(' ')} data-device-type="iOS" data-mode={mode}>
      <div className="__dumi-default-device-status">
        <span>mixdoc</span>
        <span>
          <Clock />
        </span>
      </div>
      <iframe title="dumi-previewer" src={url} key={renderKey} />
      <div className="__dumi-default-device-action">
        <button className="__dumi-default-icon" role="refresh" onClick={() => setRenderKey(Math.random())} />
        <button className="__dumi-default-icon" role="qrcode">
          <QRCode value={typeof url === 'string' ? url : ''} size={96} />
        </button>
        <a href={url} target="_blank" rel="noreferrer" className="__dumi-default-icon" role="open-demo" />
      </div>
    </div>
  );
};

export default Device;
