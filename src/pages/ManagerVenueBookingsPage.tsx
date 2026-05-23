import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

function ManagerVenueBookingsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    async function loadVenue() {
      if (!id) {
        setErrorMessage("This venue link is missing an ID.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch {
        setErrorMessage("Could not load the bookings for this venue.");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

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

  if (!isLoggedIn) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Manager access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Venue bookings
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Log in as a venue manager to view bookings for your listings.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!user?.venueManager) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Restricted access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Venue managers only
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              This page is only available for venue managers.
            </p>

            <Link
              to="/profile"
              className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
            >
              Go to profile
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return <p className="p-6">Loading bookings...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">{errorMessage}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/manager"
        className="mb-6 inline-block text-sm font-medium text-[#174e4f] underline"
      >
        Back to dashboard
      </Link>

      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
          Venue bookings
        </p>

        <h1 className="text-5xl font-extrabold leading-tight">{venue.name}</h1>

        <p className="mt-4 max-w-2xl text-lg text-stone-100">
          View booking dates and guest counts for this venue.
        </p>
      </div>

      <div className="mb-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
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

            return (
              <div
                key={formattedDate}
                className={`flex h-14 items-center justify-center rounded-2xl text-sm font-semibold ${
                  booked
                    ? "bg-red-100 text-red-700 ring-2 ring-red-300"
                    : "bg-[#fffaf3] text-stone-700"
                }`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-100 ring-2 ring-red-300" />
            <span>Booked</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#fffaf3]" />
            <span>Available</span>
          </div>
        </div>
      </div>

      <div className="mb-5 border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-bold text-stone-800">Bookings</h2>

        <p className="mt-2 text-stone-600">
          Detailed overview of current reservations for this venue.
        </p>
      </div>

      {venue.bookings && venue.bookings.length > 0 ? (
        <ul className="space-y-4">
          {venue.bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex flex-col gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {booking.customer?.avatar?.url ? (
                    <img
                      src={booking.customer.avatar.url}
                      alt={
                        booking.customer.avatar.alt || booking.customer.name
                      }
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-[#f6d7c3]"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fffaf3] font-bold text-stone-500 ring-2 ring-[#f6d7c3]">
                      {booking.customer?.name?.charAt(0) || "?"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-stone-800">
                      {booking.customer?.name || "Guest"}
                    </p>

                    <p className="text-sm text-stone-500">
                      {booking.customer?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="w-fit rounded-full bg-[#174e4f] px-4 py-2 text-sm font-semibold text-white">
                  {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="flex items-stretch gap-4">
                <div className="w-full rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-sm text-stone-500">Check-in</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </p>
                </div>

                <div className="w-full rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-sm text-stone-500">Check-out</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-stone-600">
            This venue does not have any bookings yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default ManagerVenueBookingsPage;