import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getVenueById,
  updateVenue,
} from "../api/venues";

import { useAuth } from "../context/AuthContext";

function EditVenuePage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { user, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 1,
    maxGuests: 1,
    imageUrl: "",
    imageAlt: "",
    city: "",
    country: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  useEffect(() => {
    async function loadVenue() {
      if (!id) {
        setErrorMessage(
          "This venue link is missing an ID.",
        );

        setLoading(false);

        return;
      }

      try {
        const response = await getVenueById(id);

        const venue = response.data;

        setFormData({
          name: venue.name || "",
          description:
            venue.description || "",
          price: venue.price || 1,
          maxGuests:
            venue.maxGuests || 1,

          imageUrl:
            venue.media?.[0]?.url || "",

          imageAlt:
            venue.media?.[0]?.alt || "",

          city:
            venue.location?.city || "",

          country:
            venue.location?.country || "",

          wifi:
            venue.meta?.wifi || false,

          parking:
            venue.meta?.parking || false,

          breakfast:
            venue.meta?.breakfast ||
            false,

          pets:
            venue.meta?.pets || false,
        });
      } catch {
        setErrorMessage(
          "Could not load this venue right now.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    if (
      event.target instanceof
        HTMLInputElement &&
      event.target.type === "checkbox"
    ) {
      const isChecked =
        event.target.checked;

      setFormData((current) => ({
        ...current,
        [name]: isChecked,
      }));

      return;
    }

    let nextValue: string | number =
      value;

    if (
      name === "price" ||
      name === "maxGuests"
    ) {
      nextValue = Number(value);
    }

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) return;

    if (
      !isLoggedIn ||
      !user?.venueManager
    ) {
      setErrorMessage(
        "Only venue managers can edit venues.",
      );

      return;
    }

    if (formData.price < 1) {
      setErrorMessage(
        "Price must be at least 1.",
      );

      return;
    }

    if (formData.maxGuests < 1) {
      setErrorMessage(
        "Max guests must be at least 1.",
      );

      return;
    }

    const media = formData.imageUrl
      ? [
          {
            url: formData.imageUrl,
            alt:
              formData.imageAlt ||
              formData.name,
          },
        ]
      : [];

    setErrorMessage("");

    setIsSubmitting(true);

    try {
      await updateVenue(id, {
        name: formData.name,
        description:
          formData.description,

        price: formData.price,

        maxGuests:
          formData.maxGuests,

        media,

        meta: {
          wifi: formData.wifi,
          parking:
            formData.parking,

          breakfast:
            formData.breakfast,

          pets: formData.pets,
        },

        location: {
          city: formData.city,
          country:
            formData.country,
        },
      });

      navigate("/manager");
    } catch {
      setErrorMessage(
        "Could not update this venue right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
              Edit your venue
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Log in as a venue manager to edit and manage your Holidaze listings.
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
              Only venue managers can edit venue listings.
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

  if (loading) {
    return (
      <p className="p-6">
        Loading venue...
      </p>
    );
  }

  if (errorMessage && !formData.name) {
    return (
      <p className="p-6 text-red-600">
        {errorMessage}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/manager"
        className="mb-6 inline-block text-sm font-medium text-[#174e4f] underline"
      >
        Back to dashboard
      </Link>

      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
          Venue editing
        </p>

        <h1 className="text-5xl font-extrabold leading-tight">
          Edit venue
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-stone-100">
          Update your venue information, amenities and media to keep your listing fresh and attractive.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-stone-800">
            Basic information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Venue name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-stone-700">
                  Price per night
                </label>

                <input
                  type="number"
                  name="price"
                  min={1}
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-stone-700">
                  Max guests
                </label>

                <input
                  type="number"
                  name="maxGuests"
                  min={1}
                  value={formData.maxGuests}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-stone-800">
            Venue media
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Image URL
              </label>

              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Image alt text
              </label>

              <input
                type="text"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleChange}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-stone-800">
            Location
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-stone-800">
            Amenities
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl bg-[#fffaf3] p-4">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.wifi}
                onChange={handleChange}
              />

              <span className="font-medium text-stone-700">
                Wifi
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-[#fffaf3] p-4">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
              />

              <span className="font-medium text-stone-700">
                Parking
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-[#fffaf3] p-4">
              <input
                type="checkbox"
                name="breakfast"
                checked={formData.breakfast}
                onChange={handleChange}
              />

              <span className="font-medium text-stone-700">
                Breakfast
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-[#fffaf3] p-4">
              <input
                type="checkbox"
                name="pets"
                checked={formData.pets}
                onChange={handleChange}
              />

              <span className="font-medium text-stone-700">
                Pets allowed
              </span>
            </label>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#174e4f] p-4 text-lg font-semibold text-white! transition hover:bg-[#123b3c]"
        >
          {isSubmitting
            ? "Saving changes..."
            : "Save changes"}
        </button>
      </form>
    </section>
  );
}

export default EditVenuePage;