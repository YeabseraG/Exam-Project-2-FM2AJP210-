import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";
import type { Venue } from "../types/venue";

function VenuePage() {
  const { id } = useParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenue() {
      if (!id) return;

      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load venue.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading venue...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      {venue.media?.[0]?.url ? (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
          className="mb-6 h-80 w-full rounded object-cover"
        />
      ) : (
        <div className="mb-6 flex h-80 w-full items-center justify-center rounded bg-stone-200 text-stone-500">
          No image available
        </div>
      )}

      <h1 className="text-4xl font-bold">{venue.name}</h1>

      <p className="mt-4 text-stone-700">{venue.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Venue details</h2>

          <p>
            <strong>Price:</strong> ${venue.price} / night
          </p>

          <p>
            <strong>Max guests:</strong> {venue.maxGuests}
          </p>

          <p>
            <strong>Rating:</strong> {venue.rating}
          </p>

          <p>
            <strong>Location:</strong> {venue.location?.city},{" "}
            {venue.location?.country}
          </p>
        </div>

        <div className="rounded border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Booking</h2>
          <p className="text-stone-600">
            Booking form and availability calendar will go here.
          </p>
        </div>
      </div>
    </section>
  );
}

export default VenuePage;