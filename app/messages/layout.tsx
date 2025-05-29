// app/messages/layout.tsx
import { Header } from "@/components/layout/header"; //
import { ProtectedRoute } from "@/components/auth/protected-route"; //

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}