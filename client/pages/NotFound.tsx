import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-extrabold tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground">Sorry, we can’t find that page.</p>
        <a href="/" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">Return Home</a>
      </div>
    </div>
  );
};

export default NotFound;
