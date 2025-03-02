import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function BgBlueSvg(props: SvgProps) {
  return (
    <Svg
      width="100%"
      height={220}
      viewBox="0 0 686 348"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      {...props}
    >
      <Path fill="#0064D2" d="M1.75391 0H685.83991V347.305H1.75391z" />
      <Path
        d="M197.332 280.651C118.551 297.59 1.754 349.936 1.754 349.936h684.458V138.571s-115.39 96.051-202.967 126.293c-105.701 36.501-176.585-7.72-285.913 15.787z"
        fill="#D9EBF4"
        fillOpacity={0.2}
      />
      <Path
        d="M195.472 271.407C116.734 289.963 0 347.305 0 347.305h684.086V115.768S568.759 220.986 481.23 254.114c-105.644 39.984-176.49-8.457-285.758 17.293z"
        fill="#D9EBF4"
        fillOpacity={0.2}
      />
    </Svg>
  );
}

export default BgBlueSvg;
