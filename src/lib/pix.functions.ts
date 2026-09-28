import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://api.misticpay.com/api";
export const UNIT_PRICE = 97.9;

function headers() {
  const ci = process.env["MISTICPAY_CLIENT_ID"];
  const cs = process.env["MISTICPAY_CLIENT_SECRET"];
  if (!ci || !cs) throw new Error("Pagamento indisponível no momento.");
  return {
    ci,
    cs,
    Authorization: "Basic " + Buffer.from(`${ci}:${cs}`).toString("base64"),
    "Content-Type": "application/json",
  };
}

function validCpf(raw: string) {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (n: number) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += Number(c[i]) * (n + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}

const createSchema = z.object({
  name: z.string().trim().min(3).max(100),
  cpf: z.string().refine(validCpf, "CPF inválido"),
  quantity: z.number().int().min(1).max(20),
});

export const createPix = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const amount = Math.round(UNIT_PRICE * data.quantity * 100) / 100;
    const orderId = `SF${Date.now()}${Math.floor(Math.random() * 1000)}`;
    try {
      const res = await fetch(`${API}/transactions/create`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          amount,
          payerName: data.name,
          payerDocument: data.cpf.replace(/\D/g, ""),
          transactionId: orderId,
          description: `SOARFLY Tools BR - Pedido ${orderId}`,
        }),
      });
      const json: any = await res.json().catch(() => ({}));
      if (!res.ok || !json?.data?.copyPaste) {
        console.error("MisticPay create error", res.status, json);
        return { ok: false as const, error: "Não foi possível gerar o Pix. Tente novamente." };
      }
      return {
        ok: true as const,
        transactionId: String(json.data.transactionId),
        copyPaste: String(json.data.copyPaste),
        qrCode: String(json.data.qrCodeBase64 ?? ""),
        amount,
      };
    } catch (e) {
      console.error("MisticPay create exception", e);
      return { ok: false as const, error: "Não foi possível gerar o Pix. Tente novamente." };
    }
  });

export const checkPix = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ transactionId: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${API}/transactions/check`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ transactionId: data.transactionId }),
      });
      const json: any = await res.json().catch(() => ({}));
      return { state: String(json?.transaction?.transactionState ?? "PENDENTE") };
    } catch {
      return { state: "PENDENTE" };
    }
  });
