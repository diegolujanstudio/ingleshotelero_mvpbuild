import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { formatIndex } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
      </header>

      <section className="mx-auto max-w-shell px-6 py-32 md:px-12">
        <p className="caps mb-6">{formatIndex(404)} · Página no encontrada</p>
        <h1 className="max-w-[20ch] font-serif text-t-h1 font-medium">
          Esta dirección no corresponde a <em>ningún hotel registrado</em>.
        </h1>
        <p className="mt-8 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Revise el enlace que le compartió Recursos Humanos, o contacte a su
          administrador.
        </p>
        <div className="mt-12">
          <ButtonLink href="/" variant="ghost" size="lg">
            Volver al inicio
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
