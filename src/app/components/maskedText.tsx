export const MaskedText = ({
  text,
  name,
}: {
  text: string;
  name: string;
}) => {
  return (
    <div
      style={{ overflow: "visible", display: "inline-flex" }}
      data-animate={`${name}-container`}
    >
      {text.split("").map((char: string, index: number) => (
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            overflow: "visible",
          }}
          data-animate={`${name}-char-container`}
          key={index}
        >
          <span
            style={{ display: "inline-block", height: "fit-content" }}
            data-animate={`${name}-char`}
          >
            {char}
          </span>
        </span>
      ))}
    </div>
  );
};
