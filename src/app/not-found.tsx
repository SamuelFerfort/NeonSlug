export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4">Short URL not found</p>
        <p className="mt-2">This link may have expired or never existed.</p>
      </div>
    );
  }