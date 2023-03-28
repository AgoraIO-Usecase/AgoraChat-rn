import * as React from 'react';
import { Text, View } from 'react-native';

type ElapsedProps = {
  timer: number; // second unit
  color?: string;
};
export const ElapsedInternal = (props: ElapsedProps): JSX.Element => {
  const { timer, color } = props;
  const [elapsed, setElapsed] = React.useState(timer);
  const elapsedRef = React.useRef(elapsed);
  const updateTime = React.useCallback(() => {
    return setInterval(() => {
      setElapsed(elapsedRef.current + 1000);
      elapsedRef.current = elapsedRef.current + 1000;
    }, 1000);
  }, []);
  const placeholder = (params: { h?: number; m: number; s: number }) => {
    const ms = params.m.toString().length < 2 ? `0${params.m}` : params.m;
    const ss = params.s.toString().length < 2 ? `0${params.s}` : params.s;
    if (params.h) {
      const hs = params.h.toString().length < 2 ? `0${params.h}` : params.h;
      return `${hs}:${ms}:${ss}`;
    } else {
      return `${ms}:${ss}`;
    }
  };
  const format = React.useCallback((elapsed: number) => {
    const seconds = Math.ceil(elapsed / 1000);
    const s = seconds % 60;
    const m = s === 0 ? Math.ceil(seconds / 60) : Math.ceil(seconds / 60) - 1;
    if (m > 60) {
      const h =
        s === 0
          ? Math.ceil(seconds / 60 / 60)
          : Math.ceil(seconds / 60 / 60) - 1;
      return placeholder({ h, m, s });
    } else {
      return placeholder({ m, s });
    }
  }, []);
  React.useEffect(() => {
    const id = updateTime();
    return () => {
      clearInterval(id);
    };
  }, [updateTime]);
  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '400',
          textAlign: 'center',
          color: color ?? 'black',
        }}
      >
        {format(elapsed)}
      </Text>
    </View>
  );
};

export const Elapsed = React.memo((props: ElapsedProps) => {
  return <ElapsedInternal {...props} />;
});
