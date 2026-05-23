import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
      <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
        <div className="rounded-3xl bg-[#174e4f] px-8 py-14 text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f6d7c3]">
            404
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            This page could not be found.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-100">
            The page you are looking for may have moved, been removed or never
            existed.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
          >
            Back to Venues
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;