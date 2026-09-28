import { createFileRoute } from "@tanstack/react-router";
import ProductPage from "@/components/ProductPage";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Kit SOARFLY 4 em 1 | Ofertas TK Shop" },
    { name: "description", content: "Conheça o kit de ferramentas SOARFLY 4 em 1 48Vf sem fio, com martelete, furadeira, esmerilhadeira e chave de impacto." },
    { property: "og:title", content: "Kit SOARFLY 4 em 1 | Ofertas TK Shop" },
    { property: "og:description", content: "Conheça o kit de ferramentas SOARFLY 4 em 1 48Vf sem fio, com martelete, furadeira, esmerilhadeira e chave de impacto." },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductPage,
});
