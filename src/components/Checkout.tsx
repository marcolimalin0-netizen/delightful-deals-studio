import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, MapPin, Minus, Plus, QrCode, Copy, Clock, Zap, Ticket, Smile } from "lucide-react";
import { toast } from "sonner";
import { createPix, checkPix } from "@/lib/pix.functions";

const FEATURED_PRODUCT_IMAGE = "https://promocoes-tkshop.lovable.app/api/public/media/uploads/1787698595803-59rx3b.webp";

type Address = {
  name: string; phone: string; email: string; cep: string; uf: string; city: string;
  district: string; street: string; number: string; complement: string; cpf: string;
};
const empty: Address = { name: "", phone: "", email: "", cep: "", uf: "", city: "", district: "", street: "", number: "", complement: "", cpf: "" };
const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const PRICE = 97.9, ORIGINAL = 326.33, SHIPPING = 26.6;
const brl = (n: number) => "R$ " + n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const fmtCpf = (s: string) => onlyDigits(s).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const fmtCep = (s: string) => onlyDigits(s).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const fmtPhone = (s: string) => onlyDigits(s).slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");

function useCountdown(start: number) {
  const [s, setS] = useState(start);
  useEffect(() => { const t = setInterval(() => setS(v => (v > 0 ? v - 1 : 0)), 1000); return () => clearInterval(t); }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return { secs: s, label: `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}` };
}

export default function Checkout({ initialQty }: { initialQty: number }) {
  const [step, setStep] = useState<"checkout" | "address" | "payment">("checkout");
  const [qty, setQty] = useState(initialQty);
  const [address, setAddress] = useState<Address | null>(null);
  const [pix, setPix] = useState<{ transactionId: string; copyPaste: string; qrCode: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const coupon = useCountdown(21 * 3600 + 56 * 60 + 55);
  const create = useServerFn(createPix);

  useEffect(() => {
    try { const a = localStorage.getItem("sf-address"); if (a) setAddress(JSON.parse(a)); } catch { /* ignore */ }
  }, []);

  const subtotal = PRICE * qty, original = ORIGINAL * qty, discount = original - subtotal;

  async function placeOrder() {
    if (!address) { toast.error("Adicione um endereço de envio"); setStep("address"); return; }
    setLoading(true);
    const r = await create({ data: { name: address.name, cpf: address.cpf, quantity: qty } }).catch(() => null);
    setLoading(false);
    if (!r || !r.ok) { toast.error(r && !r.ok ? r.error : "Não foi possível gerar o Pix."); return; }
    setPix(r); setStep("payment"); window.scrollTo(0, 0);
  }

  if (step === "address") return <AddressForm initial={address ?? empty} onBack={() => setStep("checkout")} onSave={a => { setAddress(a); localStorage.setItem("sf-address", JSON.stringify(a)); setStep("checkout"); }} />;
  if (step === "payment" && pix) return <Payment pix={pix} onBack={() => setStep("checkout")} />;

  return (
    <div className="co-page">
      <header className="co-header"><Link to="/p/ferramentas" aria-label="Voltar"><ChevronLeft /></Link><h1>Finalizar pedido</h1><span /></header>
      <button className="co-address" onClick={() => setStep("address")}>
        <MapPin size={20} />
        {address ? <div className="co-address-filled"><strong>{address.name} <span>{address.phone}</span></strong><small>{address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ""}, {address.district}, {address.city} - {address.uf}, {address.cep}</small></div>
          : <><strong>Endereço de envio</strong><span className="co-add">+ Adicionar endereço</span></>}
        {address && <ChevronRight size={18} />}
      </button>
      <div className="co-stripe" />
      <section className="co-card">
        <div className="co-store"><strong>SOARFLY Tools BR</strong></div>
        <div className="co-item">
          <img src={FEATURED_PRODUCT_IMAGE} alt="Kit SOARFLY 4 em 1" />
          <div>
            <p className="co-title">[SOARFLY] Kit Ferramentas 4 em 1 48Vf | Íon Lítio Baterias Sem Fio</p>
            <span className="co-flash"><Zap size={11} fill="currentColor" /> Oferta Relâmpago <b>{coupon.label}</b></span>
            <div className="co-price-row"><div><div className="co-price">{brl(PRICE)}</div><s>{brl(ORIGINAL)}</s> <span className="co-off">-70%</span></div>
              <div className="co-qty"><button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir"><Minus size={14} /></button><span>{qty}</span><button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Aumentar"><Plus size={14} /></button></div></div>
          </div>
        </div>
        <div className="co-ship"><span>Receba até 29 de set. – 1 de out.</span><span><s>{brl(SHIPPING)}</s> <b>Grátis</b></span></div>
      </section>
      <section className="co-card co-discount"><Ticket size={18} /><strong>Desconto da loja</strong><div><span className="co-free">Frete grátis</span><span className="co-minus">- {brl(discount)}</span></div></section>
      <section className="co-card co-summary">
        <h2>Resumo do pedido</h2>
        <div className="row b"><span>Subtotal do produto</span><span>{brl(subtotal)}</span></div>
        <div className="row"><span>Preço original</span><span>{brl(original)}</span></div>
        <div className="row"><span>Desconto no produto</span><span className="red">- {brl(discount)}</span></div>
        <div className="row b"><span>Subtotal do envio</span><span>R$ 0,00</span></div>
        <div className="row"><span>Taxa de envio</span><span>{brl(SHIPPING)}</span></div>
        <div className="row"><span>Desconto de envio</span><span className="red">- {brl(SHIPPING)}</span></div>
        <div className="row total"><span>Total</span><span>{brl(subtotal)}</span></div>
        <small className="tax">Impostos inclusos</small>
      </section>
      <section className="co-card">
        <h2>Forma de pagamento</h2>
        <div className="co-pay"><QrCode size={20} className="teal" /><div><strong>Pix</strong><small>Pagamento instantâneo · Aprovação em segundos</small></div><span className="co-radio" /></div>
      </section>
      <p className="co-terms">Ao fazer um pedido, você concorda com os Termos de uso e a Política de privacidade da SOARFLY Tools BR.</p>
      <div className="co-footer">
        <div className="co-save"><Smile size={14} /> Você está economizando {brl(discount + SHIPPING)} nesse pedido.</div>
        <div className="co-total"><span>Total ({qty} {qty > 1 ? "itens" : "item"})</span><strong>{brl(subtotal)}</strong></div>
        <button className="co-btn" disabled={loading} onClick={placeOrder}>{loading ? "Gerando Pix..." : "Fazer pedido"}<small>O cupom expira em {coupon.label}</small></button>
      </div>
    </div>
  );
}

function AddressForm({ initial, onBack, onSave }: { initial: Address; onBack: () => void; onSave: (a: Address) => void }) {
  const [a, setA] = useState<Address>(initial);
  const [def, setDef] = useState(true);
  const set = (k: keyof Address, v: string) => setA(p => ({ ...p, [k]: v }));
  const valid = a.name.trim().split(/\s+/).length >= 2 && onlyDigits(a.phone).length >= 10 && /^\S+@\S+\.\S+$/.test(a.email)
    && onlyDigits(a.cep).length === 8 && a.uf && a.city.trim() && a.district.trim() && a.street.trim() && a.number.trim() && onlyDigits(a.cpf).length === 11;

  async function lookupCep(v: string) {
    const d = onlyDigits(v);
    if (d.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`).then(r => r.json());
      if (!r.erro) setA(p => ({ ...p, uf: r.uf || p.uf, city: r.localidade || p.city, district: r.bairro || p.district, street: r.logradouro || p.street }));
    } catch { /* ignore */ }
  }

  return (
    <div className="co-page addr">
      <header className="co-header"><button onClick={onBack} aria-label="Voltar"><ChevronLeft /></button><h1>Adicionar o novo endereço</h1><span /></header>
      <div className="addr-label">Informações de contato</div>
      <input placeholder="Nome completo" maxLength={100} value={a.name} onChange={e => set("name", e.target.value)} />
      <div className="addr-phone"><span>BR +55</span><input placeholder="Número de telefone" inputMode="tel" value={a.phone} onChange={e => set("phone", fmtPhone(e.target.value))} /></div>
      <input placeholder="Email" type="email" maxLength={255} value={a.email} onChange={e => set("email", e.target.value)} />
      <div className="addr-label">Informações de endereço</div>
      <input placeholder="CEP/Código postal" inputMode="numeric" value={a.cep} onChange={e => { const v = fmtCep(e.target.value); set("cep", v); lookupCep(v); }} />
      <div className="addr-split">
        <select value={a.uf} onChange={e => set("uf", e.target.value)}><option value="">Estado/UF</option>{UFS.map(u => <option key={u}>{u}</option>)}</select>
        <input placeholder="Cidade" maxLength={80} value={a.city} onChange={e => set("city", e.target.value)} />
      </div>
      <input placeholder="Bairro/Distrito" maxLength={80} value={a.district} onChange={e => set("district", e.target.value)} />
      <input placeholder="Endereço" maxLength={120} value={a.street} onChange={e => set("street", e.target.value)} />
      <input placeholder='Nº da residência. Use "s/n" se nenhum' maxLength={10} value={a.number} onChange={e => set("number", e.target.value)} />
      <input placeholder="Apartamento, bloco, unidade etc. (opcional)" maxLength={80} value={a.complement} onChange={e => set("complement", e.target.value)} />
      <div className="addr-label">Informações fiscais</div>
      <input placeholder="CPF" inputMode="numeric" value={a.cpf} onChange={e => set("cpf", fmtCpf(e.target.value))} />
      <small className="addr-hint">O CPF será usado para emitir a nota fiscal.</small>
      <div className="addr-label">Configurações</div>
      <label className="addr-toggle"><span>Definir como padrão</span><input type="checkbox" checked={def} onChange={e => setDef(e.target.checked)} /></label>
      <div className="co-footer addr-footer">
        <p>Leia a Política de privacidade da SOARFLY Tools BR para saber como usamos suas informações.</p>
        <button className="co-btn" disabled={!valid} onClick={() => onSave(a)}>Salvar</button>
      </div>
    </div>
  );
}

function Payment({ pix, onBack }: { pix: { transactionId: string; copyPaste: string; qrCode: string; amount: number }; onBack: () => void }) {
  const t = useCountdown(10 * 60);
  const [paid, setPaid] = useState(false);
  const check = useServerFn(checkPix);
  const deadline = new Date(Date.now() + 10 * 60 * 1000);

  useEffect(() => {
    if (paid) return;
    const i = setInterval(async () => {
      const r = await check({ data: { transactionId: pix.transactionId } }).catch(() => null);
      if (r?.state === "COMPLETO") { setPaid(true); toast.success("Pagamento aprovado!"); }
    }, 5000);
    return () => clearInterval(i);
  }, [paid, pix.transactionId, check]);

  const copy = async () => { await navigator.clipboard.writeText(pix.copyPaste); toast.success("Código Pix copiado"); };
  const [deadlineLabel] = useState(() => deadline.toLocaleString("pt-BR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));

  return (
    <div className="co-page pay">
      <header className="co-header"><button onClick={onBack} aria-label="Voltar"><ChevronLeft /></button><h1>Código do pagamento</h1><span /></header>
      <div className="pay-head">
        <div><h2>{paid ? "Pagamento aprovado" : t.secs === 0 ? "Pagamento expirado" : "Aguardando o pagamento"}<br />{brl(pix.amount)}</h2>
          {!paid && <><p>Vence em: <span className="pay-timer"><Clock size={12} /> {t.label.slice(3)}</span></p><p>Prazo <b>{deadlineLabel}</b></p></>}
        </div>
        <span className={paid ? "pay-icon ok" : "pay-icon"}><Clock size={22} /></span>
      </div>
      {!paid && <div className="pay-card">
        <div className="pay-pix"><QrCode size={20} className="teal" /> PIX</div>
        {pix.qrCode && <img className="pay-qr" src={pix.qrCode} alt="QR Code Pix" />}
        <p className="pay-code">{pix.copyPaste.slice(0, 32)}...</p>
        <button className="co-btn" onClick={copy}><Copy size={16} /> Copiar</button>
      </div>}
      <h3 className="pay-how">Como fazer pagamentos com PIX?</h3>
      <p className="pay-text">Copie o código de pagamento acima, selecione Pix no seu app de internet ou de banco e cole o código. Ou escaneie o QR Code.</p>
      <div className="pay-bottom"><Link to="/p/ferramentas" className="pay-view">Voltar à loja</Link></div>
    </div>
  );
}
