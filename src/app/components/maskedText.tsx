export const MaskedText = ({
  text,
  name,
}: {
  text: string;
  name: string;
}) => {
  return (
    <div
      style={{ overflow: "hidden", display: "inline-flex" }}
      data-animate={`${name}-container`}
    >
      {text.split("").map((char: string, index: number) => (
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            overflow: "hidden",
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
