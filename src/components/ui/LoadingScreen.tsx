'use client';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
