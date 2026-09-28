import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Minus, Plus, Store, Star, Truck, ShieldCheck, Bookmark, CreditCard, Grid2X2, Ticket, X, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { resolveAssetUrl } from "@/lib/assetUrl";
import gallery1 from "@/assets/ferramentas/gallery-1.asset.json";
import gallery2 from "@/assets/ferramentas/gallery-2.asset.json";
import gallery3 from "@/assets/ferramentas/gallery-3.asset.json";
import gallery4 from "@/assets/ferramentas/gallery-4.asset.json";
import gallery5 from "@/assets/ferramentas/gallery-5.asset.json";
import gallery6 from "@/assets/ferramentas/gallery-6.asset.json";
import gallery7 from "@/assets/ferramentas/gallery-7.asset.json";
import gallery8 from "@/assets/ferramentas/gallery-8.asset.json";
import gallery9 from "@/assets/ferramentas/gallery-9.asset.json";
import gallery10 from "@/assets/ferramentas/gallery-10.asset.json";
import creator1 from "@/assets/ferramentas/creator-1.asset.json";
import creator2 from "@/assets/ferramentas/creator-2.asset.json";
import creator3 from "@/assets/ferramentas/creator-3.asset.json";
import creator4 from "@/assets/ferramentas/creator-4.asset.json";
import creator5 from "@/assets/ferramentas/creator-5.asset.json";
import creator6 from "@/assets/ferramentas/creator-6.asset.json";
import creator7 from "@/assets/ferramentas/creator-7.asset.json";
import creator8 from "@/assets/ferramentas/creator-8.asset.json";
import creator9 from "@/assets/ferramentas/creator-9.asset.json";
import poster1 from "@/assets/ferramentas/poster-1.asset.json";
import poster2 from "@/assets/ferramentas/poster-2.asset.json";
import poster3 from "@/assets/ferramentas/poster-3.asset.json";
import poster4 from "@/assets/ferramentas/poster-4.asset.json";
import poster5 from "@/assets/ferramentas/poster-5.asset.json";
import poster6 from "@/assets/ferramentas/poster-6.asset.json";
import poster7 from "@/assets/ferramentas/poster-7.asset.json";
import poster8 from "@/assets/ferramentas/poster-8.asset.json";
import poster9 from "@/assets/ferramentas/poster-9.asset.json";
import review1 from "@/assets/ferramentas/review-1.asset.json";
import review2 from "@/assets/ferramentas/review-2.asset.json";
import review3 from "@/assets/ferramentas/review-3.asset.json";
import review4 from "@/assets/ferramentas/review-4.asset.json";
import review5 from "@/assets/ferramentas/review-5.asset.json";
import review6 from "@/assets/ferramentas/review-6.asset.json";
import description1 from "@/assets/ferramentas/description-1.asset.json";
import description2 from "@/assets/ferramentas/description-2.asset.json";
import description3 from "@/assets/ferramentas/description-3.asset.json";
import description4 from "@/assets/ferramentas/description-4.asset.json";
import description5 from "@/assets/ferramentas/description-5.asset.json";
import description6 from "@/assets/ferramentas/description-6.asset.json";
import description7 from "@/assets/ferramentas/description-7.asset.json";
import description8 from "@/assets/ferramentas/description-8.asset.json";

const gallery = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10].map(x => resolveAssetUrl(x));
const creators = [creator1, creator2, creator3, creator4, creator5, creator6, creator7, creator8, creator9].map(x => resolveAssetUrl(x));
const posters = [poster1, poster2, poster3, poster4, poster5, poster6, poster7, poster8, poster9].map(x => resolveAssetUrl(x));
const descriptions = [description1, description2, description3, description4, description5, description6, description7, description8].map(x => resolveAssetUrl(x));
const creatorNames = ["matias_shop", "diego_shop", "falapiazao", "gilson_indica", "gilson_indica", "dilsopedreiro", "jeff_ferramentas", "gledsonsoares", "josieldicas"];
const reviews = [
  { name: "T***a", text: "Produto muito bom e de ótima qualidade. Chegou rápido e bem embalado, recomendo!", images: [resolveAssetUrl(review1)] },
  { name: "R***o", text: "Bom Produto, me surpreendi com qualidade. Motor brushless muito potente.", images: [resolveAssetUrl(review2)] },
  { name: "G**e M**a B**s", text: "Chegou, tudo funcionando so não testei ainda mais vou testar no serviço ai eu falo o desempenho", images: [resolveAssetUrl(review3), resolveAssetUrl(review4)] },
  { name: "V**r H**o", text: "Eu achava que nao ia recebe porque paguei muito barato mas recebi tudo certo . Recomendo", images: [resolveAssetUrl(review5)] },
  { name: "W**r S**a", text: "recebi tudo certo , ferramentas top , testei e sao brutas . comprei mais 4 pra revender na firma", images: [resolveAssetUrl(review6)] },
];

export default function ProductPage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sheet, setSheet] = useState<"cart" | "buy" | "protection" | "shipping" | "chat" | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [remaining, setRemaining] = useState(23 * 3600 + 13 * 60 + 44);
  const touchX = useRef<number | null>(null);
  const overview = useRef<HTMLElement>(null);
  const ratings = useRef<HTMLElement>(null);
  const details = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("Visão geral");
  useEffect(() => { const timer = window.setInterval(() => setRemaining(n => n > 0 ? n - 1 : 23 * 3600 + 13 * 60 + 44), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { document.body.style.overflow = sheet ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [sheet]);
  const time = [Math.floor(remaining / 3600), Math.floor((remaining % 3600) / 60), remaining % 60].map(n => String(n).padStart(2, "0")).join(":");
  const navigateTo = (label: string) => {
    setActiveTab(label);
    const target = label === "Avaliações" ? ratings : label === "Descrição" ? details : overview;
    target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const advance = (step: number) => setSlide(n => (n + step + gallery.length) % gallery.length);
  const close = () => setSheet(null);
  const addCart = () => { setCartCount(n => n + quantity); close(); };

  return <div className="shop-outer"><main className="shop-page">
    <nav className="top-tabs" aria-label="Navegação do produto">
      {(["Visão geral", "Avaliações", "Descrição"] as const).map(label => <Button key={label} variant="ghost" className={activeTab === label ? "top-tab active" : "top-tab"} onClick={() => navigateTo(label)}>{label}</Button>)}
    </nav>
    <section ref={overview} className="overview-section">
      <div className="gallery" onTouchStart={e => { touchX.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={e => { if (touchX.current !== null && e.changedTouches[0] && Math.abs(e.changedTouches[0].clientX - touchX.current) > 40) advance(e.changedTouches[0].clientX < touchX.current ? 1 : -1); touchX.current = null; }}>
        <img src={gallery[slide]} alt={`Kit de ferramentas SOARFLY — imagem ${slide + 1}`} className="gallery-image" />
        <div className="gallery-actions"><Button variant="ghost" size="icon" aria-label="Imagem anterior" onClick={() => advance(-1)}><ChevronLeft /></Button><Button variant="ghost" size="icon" aria-label="Próxima imagem" onClick={() => advance(1)}><ChevronRight /></Button></div>
        <span className="gallery-count">{slide + 1}/{gallery.length}</span>
      </div>
      <div className="price-banner"><div className="price-left"><div><span className="discount-pill">-70%</span><span className="currency">R$</span><strong>97</strong><b>,90</b><Ticket size={13} className="price-ticket" /></div><s>R$ 326,33</s></div><div className="flash"><b><Zap size={15} fill="currentColor" /> Oferta Relâmpago</b><span>Termina em: {time}</span></div></div>
      <div className="product-summary">
        <div className="installments"><CreditCard size={15} /> <span>9x de R$ 10,88 <em>sem juros</em></span><ChevronRight size={14} /></div>
        <p className="maximum-discount"><Ticket size={15} /> Desconto máximo de R$ 228,43 aplicado</p>
        <div className="product-title-line"><h1>[SOARFLY] Kit Ferramentas 4 em 1 48Vf | Íon Lítio Baterias Sem Fio| Martelete + Esmerilhadeira + ...</h1><Button variant="ghost" size="icon" onClick={() => setSaved(!saved)} aria-label={saved ? "Remover dos salvos" : "Salvar produto"}><Bookmark size={22} fill={saved ? "currentColor" : "none"} /></Button></div>
        <div className="rating-line"><Star size={15} fill="currentColor" /><strong>4.8</strong><a onClick={() => navigateTo("Avaliações")}>(236)</a><span className="rating-divider" /><b>3.471</b><span>vendidos</span></div>
      </div>
      <div className="overview-rows">
        <Button variant="ghost" className="info-row shipping" onClick={() => setSheet("shipping")}><Truck size={18} /><span><span className="free-label">Frete grátis</span><s>R$ 26,60</s><strong>Receba até 29 de set. – 1 de out.</strong></span><ChevronRight size={18} /></Button>
        <Button variant="ghost" className="info-row option" onClick={() => setSheet("buy")}><Grid2X2 size={18} /><img src={gallery[0]} alt="Kit 4 em 1" /><span>Selecionado: <strong>4 em 1</strong></span><ChevronRight size={18} /></Button>
        <Button variant="ghost" className="info-row protection" onClick={() => setSheet("protection")}><ShieldCheck size={19} /><span><strong>Proteção do cliente</strong><small><span>✓ Devolução gratuita</span><span>✓ Reembolso se algo der errado</span><span>✓ Pagamento seguro</span><span>✓ Se o seu pedido não for enviado no prazo</span></small></span><ChevronRight size={18} /></Button>
      </div>
      <section className="creators-section"><h2>Vídeos de criadores (9)</h2><div className="creators-track">{posters.map((url, i) => <div className="creator-card" key={url}><img src={url} alt={`Vídeo de ${creatorNames[i]}`} loading="lazy" /><span><img src={creators[i]} alt="" />{creatorNames[i]}</span></div>)}</div></section>
    </section>
    <section ref={ratings} className="ratings-section"><div className="section-heading"><Star size={18} fill="currentColor" /><b>4.8</b><span className="heading-divider" /><h2>Avaliações dos clientes (236)</h2><Button variant="ghost" onClick={() => navigateTo("Avaliações")}>Ver mais <ChevronRight size={15} /></Button></div>
      {reviews.map(review => <article className="review" key={review.name}><div className="review-avatar">{review.name[0]}</div><div className="review-body"><strong>{review.name}</strong><div className="review-stars">★★★★★ <span>· 4 em 1</span></div><p>{review.text}</p><div className="review-images">{review.images.map(url => <img key={url} src={url} alt={`Foto da avaliação de ${review.name}`} loading="lazy" />)}</div></div></article>)}
      <Button variant="outline" className="all-reviews" onClick={() => navigateTo("Avaliações")}>Ver todas as 236 avaliações <ChevronRight size={17} /></Button>
    </section>
    <section className="seller-section"><div className="seller-logo">SOARFLY</div><div><h2>SOARFLY Tools BR</h2><p>18.0K vendido(s)</p><div className="seller-stats"><span><b>100%</b> responde em 24 horas</span><span><b>100%</b> envios pontuais</span></div></div></section>
    <section ref={details} className="details-section"><h2>Sobre este produto</h2><h3>Detalhes</h3><div className="detail-attribute"><span>Quantidade por embalagem</span><b>4</b></div><h3>Descrição</h3><p>Bem-vindo à SOARFLY</p><p>A seguir, apresentamos nossa linha de produtos. Caso tenha alguma dúvida sobre nossos produtos, entre em contato com nosso serviço de atendimento ao cliente. Responderemos o mais breve possível durante o horário comercial.</p><p>SOARFLY Kit de Ferramentas Sem Fio 4 em 1 48Vf com Motores Brushless e 2 Baterias de Lítio</p><p>Conjunto profissional de ferramentas elétricas sem fio, ideal para reformas, manutenção, montagem, perfuração, corte e reparos em ambientes residenciais e externos.</p><p>Equipado com motores brushless (sem escovas) de cobre puro e baterias de lítio de alta capacidade, oferecendo maior potência, eficiência energética e vida útil prolongada.</p><h3>1. Principais Características</h3><p>• Motor Brushless de Cobre Puro<br />Maior potência e desempenho. Menor desgaste e aquecimento. Vida útil mais longa.</p><p>• Sistema Sem Fio 48Vf<br />Mais liberdade de movimento. Ideal para trabalhos externos e em altura.</p><p>• Baterias de Lítio de Alta Capacidade<br />Longa autonomia de trabalho. Recarga rápida e eficiente.</p><h3>2. Ferramentas Inclusas</h3>{descriptions.map((url, i) => <img className="description-image" key={url} src={url} alt={`Detalhes do kit de ferramentas ${i + 1}`} loading="lazy" />)}<h3>3. Aplicações</h3><p>Reformas residenciais, instalação de móveis, trabalhos em madeira e metal, perfuração de concreto e alvenaria, manutenção automotiva e reparos domésticos.</p><h3>4. Especificações Gerais</h3><p>Voltagem: 48Vf<br />Tipo de alimentação: Bateria de lítio recarregável<br />Tecnologia do motor: Brushless (sem escovas)</p><h3>5. Conteúdo da Embalagem</h3><p>1 × Martelete Perfurador Brushless<br />1 × Furadeira e Parafusadeira Brushless<br />1 × Chave de Impacto Brushless<br />1 × Esmerilhadeira Angular Brushless<br />2 × Baterias de Lítio 48Vf<br />1 × Carregador<br />1 × Kit de Acessórios<br />1 × Caixa de Transporte<br />1 × Manual de Instruções</p></section>
    <footer className="bottom-bar"><Button variant="ghost" className="bottom-icon" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}><Store size={23} /><span>Loja</span></Button><Button variant="ghost" className="bottom-icon" onClick={() => setSheet("chat")}><MessageCircle size={23} /><span>Chat</span></Button><Button className="cart-button" onClick={() => setSheet("cart")}>Adicionar<br />ao carrinho{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</Button><Button className="buy-button" onClick={() => setSheet("buy")}>Comprar agora<small>Frete grátis</small></Button></footer>
    {sheet && <div className="sheet-overlay" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}><div className="sheet" role="dialog" aria-modal="true" aria-label={sheet === "protection" ? "Proteção do cliente" : sheet === "shipping" ? "Informações do frete" : sheet === "chat" ? "Chat" : "Escolha do produto"}><Button variant="ghost" size="icon" className="sheet-close" onClick={close} aria-label="Fechar"><X /></Button>
      {(sheet === "cart" || sheet === "buy") ? <><div className="sheet-product"><img src={gallery[0]} alt="Kit SOARFLY 4 em 1" /><div><div className="sheet-price"><span>-70%</span> R$ 97,90</div><s>R$ 326,33</s><p><span className="free-label">Frete grátis</span> Desconto máximo de R$ 228,43 aplicado</p></div></div><div className="sheet-flash">⚡ Oferta Relâmpago <span>Termina em: {time}</span></div><h3>combinação (1)</h3><Button variant="outline" className="selected-combination"><img src={gallery[0]} alt="4 em 1" /><span>4 em 1</span><Check size={15} /></Button><div className="quantity-line"><strong>Quantidade</strong><div><Button variant="outline" size="icon" onClick={() => setQuantity(n => Math.max(1,n-1))} disabled={quantity === 1} aria-label="Diminuir quantidade"><Minus /></Button><span>{quantity}</span><Button variant="outline" size="icon" onClick={() => setQuantity(n => n+1)} aria-label="Aumentar quantidade"><Plus /></Button></div></div><Button className={sheet === "cart" ? "sheet-submit cart-button" : "sheet-submit buy-button"} onClick={sheet === "cart" ? addCart : () => navigate({ to: "/checkout", search: { qty: quantity } })}>{sheet === "cart" ? "Adicionar ao carrinho" : "Comprar agora"}</Button></> : sheet === "protection" ? <><h2>Proteção do cliente</h2><div className="protection-copy"><h3>Devoluções gratuitas em 30 dias</h3><p>Devolução gratuita em até 30 dias após o recebimento do seu produto. Os Termos e Condições se aplicam.</p><h3>Pagamento seguro</h3><p>A SOARFLY Tools BR não vende, aluga ou cede suas informações pessoais a terceiros para fins de marketing.</p><h3>Reembolso se algo der errado</h3><p>Se o seu pedido for perdido ou danificado durante o transporte antes de chegar, reembolsaremos automaticamente o seu dinheiro.</p></div></> : sheet === "shipping" ? <><h2>Frete grátis</h2><p className="sheet-info">Receba até 29 de set. – 1 de out.</p></> : <><h2>Chat</h2><p className="sheet-info">Fale com a SOARFLY Tools BR pelo nosso atendimento.</p></>}
    </div></div>}
  </main></div>;
}
