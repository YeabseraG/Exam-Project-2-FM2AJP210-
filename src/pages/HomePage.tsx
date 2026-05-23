import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getVenues } from "../api/venues";
import type { Venue } from "../types/venue";

function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredVenues = useMemo(() => {
    const filtered = venues.filter((venue) => {
      const query = searchQuery.toLowerCase();

      return (
        venue.name.toLowerCase().includes(query) ||
        venue.description.toLowerCase().includes(query) ||
        venue.location?.city?.toLowerCase().includes(query) ||
        venue.location?.country?.toLowerCase().includes(query)
      );
    });

    // Copy before sorting so the filtered array itself isnt messed with
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        case "guests":
          return b.maxGuests - a.maxGuests;

        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [venues, searchQuery, sortBy]);

  useEffect(() => {
    async function loadVenues() {
      try {
        const response = await getVenues();

        setVenues(response.data);
      } catch {
        setError(
          "Could not load venues right now. Please refresh the page or try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  if (loading) {
    return <p className="p-6">Loading venues...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-16 text-white shadow-lg">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f6d7c3]">
            Escape the ordinary
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            Find your perfect Venue.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-100">
            Discover unique stays, cozy cabins, beachside venues and unforgettable locations with Holidaze.
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label
            htmlFor="venue-search"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Search venues
          </label>

          <input
            id="venue-search"
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search by name, city or country..."
            className="w-full rounded-xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
          />
        </div>

        <div>
          <label
            htmlFor="venue-sort"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            Sort venues
          </label>

          <select
            id="venue-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="w-full rounded-xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
          >
            <option value="name">Name A–Z</option>
            <option value="price-low">
              Price: low to high
            </option>
            <option value="price-high">
              Price: high to low
            </option>
            <option value="rating">
              Rating: high to low
            </option>
            <option value="guests">
              Guests: high to low
            </option>
          </select>
        </div>
      </div>

      {filteredVenues.length === 0 ? (
        <p className="text-stone-600">
          No venues matched your search.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVenues.map((venue) => {
            const amenities = [
              { label: "Wifi", available: venue.meta?.wifi },
              { label: "Parking", available: venue.meta?.parking },
              { label: "Breakfast", available: venue.meta?.breakfast },
              { label: "Pets", available: venue.meta?.pets },
            ].filter((amenity) => amenity.available);

            return (
              <Link
                key={venue.id}
                to={`/venues/${venue.id}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {venue.media?.[0]?.url ? (
                  <div className="overflow-hidden">
                    <img
                      src={venue.media[0].url}
                      alt={
                        venue.media[0].alt ||
                        venue.name
                      }
                      className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-60 w-full items-center justify-center bg-stone-200 text-stone-500">
                    No image available
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">
                        {venue.name}
                      </h2>

                      <p className="mt-1 text-sm text-stone-500">
                        {venue.location?.city},{" "}
                        {venue.location?.country}
                      </p>
                    </div>

                    <div className="rounded-full bg-[#174e4f] px-3 py-1 text-sm font-semibold text-white">
                      ★ {venue.rating}
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">
                    {venue.description}
                  </p>

                  {amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <span
                          key={amenity.label}
                          className="rounded-full bg-[#f7f3ea] px-3 py-1 text-xs font-medium text-[#174e4f]"
                        >
                          {amenity.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-[#174e4f]">
                        ${venue.price}
                      </p>

                      <p className="text-sm text-stone-500">
                        per night
                      </p>
                    </div>

                    <div className="text-sm text-stone-600">
                      Up to{" "}
                      <span className="font-semibold text-stone-800">
                        {venue.maxGuests}
                      </span>{" "}
                      guests
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HomePage;