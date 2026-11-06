const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>

        <p className="mt-4 text-sm font-medium text-slate-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

