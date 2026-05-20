import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold">
        Holidaze
      </h1>

      {isLoggedIn ? (
        <div className="mt-4 space-y-2">
          <p>
            Logged in as: <strong>{user?.name}</strong>
          </p>

          <p>Email: {user?.email}</p>

          <p>
            Role:{" "}
            {user?.venueManager
              ? "Venue Manager"
              : "Customer"}
          </p>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="mt-4">You are not logged in.</p>
      )}
    </section>
  );
}

export default HomePage;