import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createVenue } from "../api/venues";
import { useAuth } from "../context/AuthContext";

function CreateVenuePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
    ) {
      const isChecked = event.target.checked;

      setFormData((current) => ({
        ...current,
        [name]: isChecked,
      }));

      return;
    }

    let nextValue: string | number = value;

    if (name === "price" || name === "maxGuests") {
      nextValue = Number(value);
    }

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoggedIn || !user?.venueManager) {
      setErrorMessage("Only venue managers can create venues.");
      return;
    }

    if (formData.price < 1) {
      setErrorMessage("Price must be at least 1.");
      return;
    }

    if (formData.maxGuests < 1) {
      setErrorMessage("Max guests must be at least 1.");
      return;
    }

    const media = formData.imageUrl
      ? [
          {
            url: formData.imageUrl,
            alt: formData.imageAlt || formData.name,
          },
        ]
      : [];

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createVenue({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        maxGuests: formData.maxGuests,
        media,
        meta: {
          wifi: formData.wifi,
          parking: formData.parking,
          breakfast: formData.breakfast,
          pets: formData.pets,
        },
        location: {
          city: formData.city,
          country: formData.country,
        },
      });

      navigate("/manager");
    } catch {
      setErrorMessage(
        "Could not create this venue. Please check the form and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-bold">Create venue</h1>

        <p className="mt-4">
          You need to{" "}
          <Link to="/login" className="underline">
            log in
          </Link>{" "}
          as a venue manager.
        </p>
      </section>
    );
  }

  if (!user?.venueManager) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-bold">Create venue</h1>

        <p className="mt-4">Only venue managers can create venues.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl p-6">
      <Link to="/manager" className="mb-6 inline-block text-sm underline">
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold">Create venue</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block font-medium">Venue name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">Price per night</label>
            <input
              type="number"
              name="price"
              min={1}
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Max guests</label>
            <input
              type="number"
              name="maxGuests"
              min={1}
              value={formData.maxGuests}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block font-medium">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Image alt text</label>
          <input
            type="text"
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />
          </div>
        </div>

        <fieldset className="rounded border bg-white p-4">
          <legend className="font-medium">Amenities</legend>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.wifi}
                onChange={handleChange}
              />
              Wifi
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="breakfast"
                checked={formData.breakfast}
                onChange={handleChange}
              />
              Breakfast
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pets"
                checked={formData.pets}
                onChange={handleChange}
              />
              Pets allowed
            </label>
          </div>
        </fieldset>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-stone-900 p-3 text-white"
        >
          {isSubmitting ? "Creating venue..." : "Create venue"}
        </button>
      </form>
    </section>
  );
}

export default CreateVenuePage;