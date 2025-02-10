import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

function LogoSvg(props: SvgProps) {
  return (
    <Svg width={40} height={40} fill="none" {...props}>
      <G
        fill="#007DFC"
        fillRule="evenodd"
        clipPath="url(#a)"
        clipRule="evenodd"
      >
        <Path d="M25.556 11.685A10 10 0 0 0 20 10V0A20 20 0 1 1 0 20h10a10 10 0 1 0 15.556-8.315Z" />
        <Path d="M10 0A10 10 0 0 1 0 10v10A20 20 0 0 0 20 0H10Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h40v40H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default LogoSvg;
