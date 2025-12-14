import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import {
  MovieCommandDialog,
  MovieSearchButton,
  SearchProvider,
} from "@/components/movie-command";
// Import the new components

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrap the entire layout in the SearchProvider to manage global dialog state
    <SearchProvider>
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full flex justify-between items-center py-3 text-sm max-w-5xl">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={"/protected"}>Movie Qlub</Link>
                {/* 2. Insert the Search Button into the Nav Bar */}
                <MovieSearchButton />
              </div>
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </nav>
          <div className="flex-1 flex flex-col w-full">
            <Suspense>{children}</Suspense>
          </div>
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Rasmus
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </div>
        {/* 3. Render the Dialog component globally */}
        <MovieCommandDialog />
      </main>
    </SearchProvider>
  );
}
