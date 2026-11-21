import { SearchX } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";

export default function NotFound() {
  return <main className="flex min-h-[70vh] items-center justify-center bg-background px-5 py-16 text-center"><div className="max-w-lg"><span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted text-foreground"><SearchX size={32}/></span><p className="mt-6 text-sm font-bold uppercase tracking-widest text-foreground">404 · Page not found</p><h1 className="mt-2 text-3xl font-extrabold text-foreground">Looks like this page is out of range.</h1><p className="mt-3 text-muted-foreground">The link may be old, or the page may have moved. Find your way back to GearNest.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href="/" variant="secondary">Go home</ButtonLink><ButtonLink href="/equipment" variant="outline">Browse equipment</ButtonLink></div></div></main>;
}
