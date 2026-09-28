import { createFileRoute } from "@tanstack/react-router";
import ProductPage from "@/components/ProductPage";

export const Route = createFileRoute("/p/ferramentas")({
  head: () => ({ meta: [
    { title: "Kit Ferramentas 4 em 1 48Vf Sem Fio | SOARFLY Tools BR" },
    { name: "description", content: "Kit de ferramentas SOARFLY 4 em 1 sem fio, com motores brushless e duas baterias de lítio 48Vf." },
    { property: "og:title", content: "Kit Ferramentas 4 em 1 48Vf Sem Fio | SOARFLY Tools BR" },
    { property: "og:description", content: "Kit de ferramentas SOARFLY 4 em 1 sem fio, com motores brushless e duas baterias de lítio 48Vf." },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductPage,
});
