import { Resend } from 'resend';

let resendSingleton: Resend | null = null;

export function getResend(): Resend {
  if (!resendSingleton) {
    resendSingleton = new Resend(process.env.RESEND_API_KEY ?? '');
  }
  return resendSingleton;
}

/** Verified domain address (set `RESEND_FROM`). Public contact: contact@sachijewellery.com. Falls back to Resend test domain. */
export function resendFromAddress(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    'Sachi Jaipur <onboarding@resend.dev>'
  );
}

/**
 * Admin inboxes for new registration alerts (one-click approve links).
 * Set `ADMIN_EMAIL` and/or `ADMIN_NOTIFICATION_EMAILS` — comma or semicolon separated.
 */
export function getAdminNotificationRecipients(): string[] {
  const parts = [process.env.ADMIN_EMAIL, process.env.ADMIN_NOTIFICATION_EMAILS]
    .filter(Boolean)
    .join(',');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of parts.split(/[,;]/)) {
    const t = s.trim();
    if (!t || !t.includes('@')) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

type SendPayload = Parameters<Resend['emails']['send']>[0];

export async function sendResendEmail(
  payload: SendPayload,
  logTag: string
): Promise<{ ok: boolean; id?: string; error?: unknown }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error(`[email:${logTag}] RESEND_API_KEY is missing`);
    return { ok: false, error: 'missing_resend_api_key' };
  }

  try {
    const { data, error } = await getResend().emails.send({
      ...payload,
      from: payload.from ?? resendFromAddress(),
    });

    if (error) {
      console.error(`[email:${logTag}] Resend error:`, JSON.stringify(error, null, 2));
      return { ok: false, error };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    console.error(`[email:${logTag}] Exception:`, err);
    return { ok: false, error: err };
  }
}
