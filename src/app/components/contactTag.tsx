type ContactTagProps = {
  url: string;
};
export default function ContactTag({ url }: ContactTagProps) {
  return (
    <p>
      <a href={url} className="text-blue-500 underline">
        {url}
      </a>
    </p>
  );
}
