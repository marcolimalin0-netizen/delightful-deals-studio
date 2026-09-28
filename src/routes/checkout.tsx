import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Checkout from "@/components/Checkout";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => z.object({ qty: z.coerce.number().int().min(1).max(20).catch(1) }).parse(s),
  head: () => ({
    meta: [
      { title: "Finalizar pedido | SOARFLY Tools BR" },
      { name: "description", content: "Finalize seu pedido do Kit Ferramentas 4 em 1 SOARFLY com frete grátis e pagamento via Pix." },
      { property: "og:title", content: "Finalizar pedido | SOARFLY Tools BR" },
      { property: "og:description", content: "Pagamento instantâneo via Pix e frete grátis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutRoute,
});

function CheckoutRoute() {
  const { qty } = Route.useSearch();
  return <Checkout initialQty={qty} />;
}
