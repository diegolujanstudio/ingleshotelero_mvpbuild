import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * Shared editorial footer.
 *
 * Used on the landing page and any public marketing/legal page (aviso,
 * términos, contacto). NOT used inside the exam flow, the HR dashboard,
 * or the pitch deck — those have their own chrome.
 */

const PRODUCTO = [
  { href: "/#por-que", label: "Por qué funciona" },
  { href: "/#como", label: "Cómo funciona" },
  { href: "/#para-quien", label: "Para quién" },
  { href: "/precios", label: "Precios" },
];

const DEMO = [
  { href: "/e/demo-hotel", label: "Tomar el examen" },
  { href: "/hr/login", label: "Dashboard de RH" },
  { href: "/demo/conversacion", label: "Simulador WhatsApp" },
];

const LEGAL = [
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/terminos", label: "Términos del servicio" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="mt-section-gap border-t border-hair bg-ivory-soft">
      <div className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[28ch] font-sans text-t-body text-espresso-soft">
              El inglés que su hotel necesita. Nada más, nada menos.
            </p>
            <p className="caps mt-6 text-espresso-muted">
              Hecho en México · Para Latinoamérica
            </p>
          </div>

          <FooterColumn title="Producto" items={PRODUCTO} />
          <FooterColumn title="Pruebe el demo" items={DEMO} />
          <FooterColumn title="Legal" items={LEGAL} />
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hair pt-8 md:flex-row md:items-center md:justify-between">
          <p className="caps text-espresso-muted">
            © 2026 · Inglés Hotelero · Diego Luján Studio
          </p>
          <p className="caps text-espresso-muted">
            Datos tratados conforme a la <em>LFPDPPP</em> de México
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="caps mb-4 text-espresso-muted">{title}</p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-sans text-t-body text-espresso transition-colors duration-200 ease-editorial hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
