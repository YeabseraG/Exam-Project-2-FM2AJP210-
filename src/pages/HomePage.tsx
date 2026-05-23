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
        setError("Could not load venues right now, Please try again later.");
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
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Holidaze</h1>

        <p className="mt-2 text-stone-600">
          Find your next accommodation.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="venue-search" className="mb-2 block font-medium">
          Search venues
        </label>

        <input
          id="venue-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name, city, country..."
          className="w-full rounded border bg-white p-3"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="venue-sort" className="mb-2 block font-medium">
          Sort venues
        </label>

        <select
          id="venue-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="w-full rounded border bg-white p-3"
        >
          <option value="name">Name A–Z</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Rating: high to low</option>
          <option value="guests">Guests: high to low</option>
        </select>
      </div>

      {filteredVenues.length === 0 ? (
        <p className="text-stone-600">No venues matched your search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Link
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="rounded border bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              {venue.media?.[0]?.url ? (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || venue.name}
                  className="mb-4 h-48 w-full rounded object-cover"
                />
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded bg-stone-200 text-stone-500">
                  No image available
                </div>
              )}

              <h2 className="text-xl font-bold">{venue.name}</h2>

              <p className="mt-2 line-clamp-3 text-sm text-stone-600">
                {venue.description}
              </p>

              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <strong>Price:</strong> ${venue.price}
                </p>

                <p>
                  <strong>Guests:</strong> {venue.maxGuests}
                </p>

                <p>
                  <strong>Rating:</strong> {venue.rating}
                </p>

                <p>
                  <strong>Location:</strong> {venue.location?.city},{" "}
                  {venue.location?.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;