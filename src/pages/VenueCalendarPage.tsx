import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { createBooking } from "../api/bookings";
import { getVenueById } from "../api/venues";
import { useAuth } from "../context/AuthContext";
import type { Venue } from "../types/venue";

function VenueCalendarPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

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
          setError("Failed to load availability.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!venue) return;

    setBookingError("");
    setBookingSuccess("");

    if (!isLoggedIn) {
      setBookingError("You must be logged in to create a booking.");
      return;
    }

    if (user?.venueManager) {
      setBookingError("Venue managers cannot create customer bookings.");
      return;
    }

    if (!formData.dateFrom || !formData.dateTo) {
      setBookingError("Please select both start and end dates.");
      return;
    }

    if (new Date(formData.dateFrom) >= new Date(formData.dateTo)) {
      setBookingError("End date must be after start date.");
      return;
    }

    if (formData.guests < 1 || formData.guests > venue.maxGuests) {
      setBookingError(`Guests must be between 1 and ${venue.maxGuests}.`);
      return;
    }

    setBookingLoading(true);

    try {
      await createBooking({
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        guests: formData.guests,
        venueId: venue.id,
      });

      setBookingSuccess("Booking created successfully.");

      setFormData({
        dateFrom: "",
        dateTo: "",
        guests: 1,
      });

      const updatedVenue = await getVenueById(venue.id);
      setVenue(updatedVenue.data);
    } catch (error) {
      if (error instanceof Error) {
        setBookingError(error.message);
      } else {
        setBookingError("Failed to create booking.");
      }
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading availability...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  return (
    <section className="mx-auto max-w-4xl p-6">
      <Link
        to={`/venues/${venue.id}`}
        className="mb-6 inline-block text-sm underline"
      >
        Back to venue
      </Link>

      <h1 className="text-3xl font-bold">
        Availability for {venue.name}
      </h1>

      <p className="mt-2 text-stone-600">
        View booked dates before choosing your stay.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="mb-4 text-xl font-bold">Booked dates</h2>

          {venue.bookings && venue.bookings.length > 0 ? (
            <ul className="space-y-3">
              {venue.bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="rounded bg-stone-100 p-4 text-sm"
                >
                  <p>
                    <strong>From:</strong>{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>To:</strong>{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-600">
              No booked dates yet. This venue is currently fully available.
            </p>
          )}
        </div>

        <div className="rounded border bg-white p-4">
          <h2 className="mb-4 text-xl font-bold">Create booking</h2>

          {!isLoggedIn && (
            <p className="mb-4 text-stone-600">
              You need to{" "}
              <Link to="/login" className="underline">
                log in
              </Link>{" "}
              to book this venue.
            </p>
          )}

          {isLoggedIn && user?.venueManager && (
            <p className="mb-4 text-stone-600">
              Venue managers cannot create customer bookings.
            </p>
          )}

          {isLoggedIn && !user?.venueManager && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">
                  From
                </label>

                <input
                  type="date"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-3"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  To
                </label>

                <input
                  type="date"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-3"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Guests
                </label>

                <input
                  type="number"
                  name="guests"
                  min={1}
                  max={venue.maxGuests}
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-3"
                />
              </div>

              {bookingError && (
                <p className="text-red-600">{bookingError}</p>
              )}

              {bookingSuccess && (
                <p className="text-green-700">{bookingSuccess}</p>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full rounded bg-stone-900 p-3 text-white"
              >
                {bookingLoading ? "Creating booking..." : "Create booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default VenueCalendarPage;