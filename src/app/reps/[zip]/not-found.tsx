import SearchForm from "@/app/components/searchForm";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center p-24 gap-4">
      <h1 className="text-3xl font-bold">
        Unable to find representatives in that district.
      </h1>
      <p className="text-lg mb-4">
        Please check the ZIP code and try again.
      </p>
      <SearchForm setReady={() => {}} />
    </div>
  );
}
