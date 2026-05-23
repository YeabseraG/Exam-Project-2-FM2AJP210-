import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { createBooking } from "../api/bookings";
import { getVenueById } from "../api/venues";
import { useAuth } from "../context/AuthContext";
import type { Venue } from "../types/venue";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function isDateBooked(date: Date, bookings: Venue["bookings"] = []) {
  return bookings.some((booking) => {
    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);

    return date >= start && date <= end;
  });
}

function VenueCalendarPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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
      if (!id) {
        setError("This venue link is missing an ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch {
        setError(
          "Could not load availability right now. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  }

  function handlePreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
      return;
    }

    setCurrentMonth((month) => month - 1);
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
      return;
    }

    setCurrentMonth((month) => month + 1);
  }

  function handleCalendarDateClick(date: Date) {
    const selectedDate = formatDate(date);

    setBookingError("");
    setBookingSuccess("");

    if (!formData.dateFrom || formData.dateTo) {
      setFormData((prev) => ({
        ...prev,
        dateFrom: selectedDate,
        dateTo: "",
      }));

      return;
    }

    if (new Date(selectedDate) <= new Date(formData.dateFrom)) {
      setFormData((prev) => ({
        ...prev,
        dateFrom: selectedDate,
        dateTo: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      dateTo: selectedDate,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!venue) return;

    setBookingError("");
    setBookingSuccess("");

    if (!isLoggedIn) {
      setBookingError("You need to log in before creating a booking.");
      return;
    }

    if (user?.venueManager) {
      setBookingError("Venue managers cannot create customer bookings.");
      return;
    }

    if (!formData.dateFrom || !formData.dateTo) {
      setBookingError("Please choose both a start date and an end date.");
      return;
    }

    if (new Date(formData.dateFrom) >= new Date(formData.dateTo)) {
      setBookingError("The end date must be after the start date.");
      return;
    }

    if (formData.guests < 1 || formData.guests > venue.maxGuests) {
      setBookingError(
        `Guest count must be between 1 and ${venue.maxGuests}.`,
      );
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

      setBookingSuccess("Your booking was created successfully.");

      setFormData({
        dateFrom: "",
        dateTo: "",
        guests: 1,
      });

      const updatedVenue = await getVenueById(venue.id);
      setVenue(updatedVenue.data);
    } catch {
      setBookingError(
        "Could not create your booking right now. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekDay = firstDayOfMonth.getDay();

  const calendarDays: Array<Date | null> = [];

  for (let i = 0; i < startWeekDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
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
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to={`/venues/${venue.id}`}
        className="mb-6 inline-block text-sm font-medium text-[#174e4f] underline"
      >
        Back to venue
      </Link>

      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
          Booking & availability
        </p>

        <h1 className="text-5xl font-extrabold leading-tight">
          {venue.name}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-stone-100">
          Check unavailable dates and create your booking securely through
          Holidaze.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="rounded-xl bg-[#fffaf3] px-4 py-2 font-semibold text-stone-700"
            >
              ←
            </button>

            <h2 className="text-2xl font-bold text-stone-800">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-xl bg-[#fffaf3] px-4 py-2 font-semibold text-stone-700"
            >
              →
            </button>
          </div>

          <div className="mb-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-stone-500">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-14" />;
              }

              const formattedDate = formatDate(date);
              const booked = isDateBooked(date, venue.bookings);

              const isSelected =
                formattedDate === formData.dateFrom ||
                formattedDate === formData.dateTo;

              const isBetweenSelectedDates =
                formData.dateFrom &&
                formData.dateTo &&
                new Date(formattedDate) > new Date(formData.dateFrom) &&
                new Date(formattedDate) < new Date(formData.dateTo);

              return (
                <button
                  key={formattedDate}
                  type="button"
                  disabled={booked}
                  onClick={() => handleCalendarDateClick(date)}
                  className={`h-14 rounded-2xl text-sm font-semibold transition ${
                    booked
                      ? "cursor-not-allowed bg-red-100 text-red-500"
                      : isSelected || isBetweenSelectedDates
                        ? "bg-[#174e4f] text-white!"
                        : "bg-[#fffaf3] text-stone-700 hover:bg-[#f6d7c3]"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#174e4f]" />
              <span>Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-100" />
              <span>Booked</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#fffaf3]" />
              <span>Available</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-stone-800">
            Create booking
          </h2>

          {!isLoggedIn && (
            <p className="mb-4 rounded-2xl bg-[#fffaf3] p-4 text-stone-600">
              You need to{" "}
              <Link
                to="/login"
                className="font-semibold text-[#174e4f] underline"
              >
                log in
              </Link>{" "}
              to book this venue.
            </p>
          )}

          {isLoggedIn && user?.venueManager && (
            <p className="mb-4 rounded-2xl bg-[#fffaf3] p-4 text-stone-600">
              Venue managers cannot create customer bookings.
            </p>
          )}

          {isLoggedIn && !user?.venueManager && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-2xl bg-[#fffaf3] p-4">
                <p className="text-sm text-stone-500">Selected dates</p>

                <p className="mt-1 font-semibold text-stone-800">
                  {formData.dateFrom || "Start date"} →{" "}
                  {formData.dateTo || "End date"}
                </p>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-stone-700">
                  From
                </label>

                <input
                  type="date"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-stone-700">
                  To
                </label>

                <input
                  type="date"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-stone-700">
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
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
                />
              </div>

              {bookingError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-600">
                  {bookingError}
                </p>
              )}

              {bookingSuccess && (
                <p className="rounded-2xl border border-green-200 bg-green-50 p-3 text-green-700">
                  {bookingSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full rounded-2xl bg-[#174e4f] p-3 font-semibold text-white! transition hover:bg-[#123b3c]"
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