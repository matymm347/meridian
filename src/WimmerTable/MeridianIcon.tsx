import Logo from "../assets/Logo design.svg";

export default function MeridianIcon() {
  const size = 60;
  return (
    <img
      src={Logo}
      width={size}
      height={size}
      style={{ paddingRight: "10px" }}
      alt="Meridian"
    />
  );
}
