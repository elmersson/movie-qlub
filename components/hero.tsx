export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center justify-center">
      <h1 className="sr-only">Movie Qlub</h1>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-3xl lg:text-4xl !leading-tight">
          The best qlub of Qred
        </p>
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="font-bold hover:underline text-3xl lg:text-4xl !leading-tight"
          rel="noreferrer"
        >
          Movie Qlub
        </a>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
