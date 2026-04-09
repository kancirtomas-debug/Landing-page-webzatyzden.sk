import { Resend } from "resend";
import { NextResponse } from "next/server";

/* ─── Brand tokens (keep in sync with globals.css) ─── */
const PURPLE = "#7B4BA8";
const PURPLE_LIGHT = "#EFE1F9";
const PURPLE_MID = "#B285E1";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_LIGHT = "#f9fafb";
const BORDER = "#e5e7eb";

const BRAND_NAME = "WebZaTýždeň";
const SENDER_DOMAIN = process.env.SENDER_DOMAIN ?? "resend.dev";
const NOTIFICATION_TO = process.env.NOTIFICATION_EMAIL ?? "info@webzatyzden.sk";

/* ─── Shared email wrapper ─── */
function emailWrapper(body: string) {
  return `
<!DOCTYPE html>
<html lang="sk">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${BG_LIGHT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_LIGHT};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header gradient bar -->
        <tr>
          <td style="height:6px;background:linear-gradient(90deg,${PURPLE_LIGHT},${PURPLE_MID},${PURPLE});"></td>
        </tr>
        <!-- Logo -->
        <tr>
          <td align="center" style="padding:32px 40px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:24px;padding-right:8px;">🚀</td>
                <td style="font-size:22px;font-weight:800;color:${TEXT_PRIMARY};letter-spacing:0.5px;">${BRAND_NAME}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        ${body}
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid ${BORDER};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="font-size:13px;color:${TEXT_MUTED};line-height:1.6;">
                  TOMAR Group s.r.o. · Prešov, Slovensko<br/>
                  <a href="mailto:info@webzatyzden.sk" style="color:${PURPLE};text-decoration:none;">info@webzatyzden.sk</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Client confirmation email ─── */
function clientEmail(name: string, phone: string) {
  return emailWrapper(`
    <tr>
      <td style="padding:0 40px 8px;">
        <h1 style="margin:0;font-size:26px;font-weight:800;color:${TEXT_PRIMARY};text-align:center;">
          Ďakujeme, ${name}! 🎉
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 40px 24px;">
        <p style="margin:0;font-size:16px;color:${TEXT_SECONDARY};text-align:center;line-height:1.6;">
          Vaša žiadosť o stretnutie bola úspešne prijatá. Ozveme sa Vám čo najskôr.
        </p>
      </td>
    </tr>
    <!-- Info card -->
    <tr>
      <td style="padding:0 40px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PURPLE_LIGHT};border-radius:12px;">
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${PURPLE};text-transform:uppercase;letter-spacing:0.5px;">Čo bude nasledovať</p>
              <p style="margin:0;font-size:15px;color:${TEXT_PRIMARY};line-height:1.6;">
                📞 &nbsp;Budeme Vás kontaktovať na <strong>${phone}</strong><br/>
                📅 &nbsp;Dohodneme si termín nezáväznej konzultácie<br/>
                🚀 &nbsp;Navrhneme riešenie presne pre Vás
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Divider text -->
    <tr>
      <td style="padding:0 40px 28px;">
        <p style="margin:0;font-size:15px;color:${TEXT_SECONDARY};line-height:1.6;">
          Ak máte medzitým akékoľvek otázky, neváhajte nám napísať na
          <a href="mailto:info@webzatyzden.sk" style="color:${PURPLE};font-weight:600;text-decoration:none;">info@webzatyzden.sk</a>.
        </p>
      </td>
    </tr>
    <!-- Sign-off -->
    <tr>
      <td style="padding:0 40px 32px;">
        <p style="margin:0;font-size:15px;color:${TEXT_PRIMARY};line-height:1.6;">
          S pozdravom,<br/>
          <strong>Maroš &amp; Tomáš</strong><br/>
          <span style="color:${TEXT_MUTED};font-size:14px;">Tím ${BRAND_NAME}</span>
        </p>
      </td>
    </tr>
  `);
}

/* ─── Business notification email ─── */
function businessEmail(name: string, email: string, phone: string) {
  return emailWrapper(`
    <tr>
      <td style="padding:0 40px 8px;">
        <h1 style="margin:0;font-size:24px;font-weight:800;color:${TEXT_PRIMARY};text-align:center;">
          Nový lead 🔔
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 40px 24px;">
        <p style="margin:0;font-size:15px;color:${TEXT_SECONDARY};text-align:center;">
          Niekto práve vyplnil dotazník na webe.
        </p>
      </td>
    </tr>
    <!-- Lead details card -->
    <tr>
      <td style="padding:0 40px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PURPLE_LIGHT};border-radius:12px;">
          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 14px;">
                    <p style="margin:0 0 2px;font-size:12px;font-weight:600;color:${PURPLE};text-transform:uppercase;letter-spacing:0.5px;">Meno</p>
                    <p style="margin:0;font-size:17px;font-weight:700;color:${TEXT_PRIMARY};">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;border-top:1px solid ${PURPLE_MID}40;">
                    <p style="margin:14px 0 2px;font-size:12px;font-weight:600;color:${PURPLE};text-transform:uppercase;letter-spacing:0.5px;">E-mail</p>
                    <p style="margin:0;font-size:17px;color:${TEXT_PRIMARY};">
                      <a href="mailto:${email}" style="color:${TEXT_PRIMARY};text-decoration:none;">${email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;border-top:1px solid ${PURPLE_MID}40;">
                    <p style="margin:14px 0 2px;font-size:12px;font-weight:600;color:${PURPLE};text-transform:uppercase;letter-spacing:0.5px;">Telefón</p>
                    <p style="margin:0;font-size:17px;font-weight:700;color:${TEXT_PRIMARY};">
                      <a href="tel:${phone}" style="color:${TEXT_PRIMARY};text-decoration:none;">${phone}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Quick action -->
    <tr>
      <td align="center" style="padding:0 40px 32px;">
        <a href="tel:${phone}" style="display:inline-block;padding:14px 36px;background-color:${PURPLE};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:999px;">
          📞 &nbsp;Zavolať ${name}
        </a>
      </td>
    </tr>
  `);
}

/* ─── API handler ─── */
export async function POST(request: Request) {
  try {
    const { email, name, phone, utm } = await request.json();

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!email || !name || !phone) {
      return NextResponse.json(
        { error: "Všetky polia sú povinné." },
        { status: 400 }
      );
    }

    // Save lead to Supabase — always save when DB is configured, projectId is optional metadata
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import("@/lib/prisma");
        if (prisma) {
          // Save to main Lead table (admin dashboard)
          await prisma.lead.create({
            data: {
              name,
              email,
              phone,
              sourcePage: process.env.VERCEL_URL ?? "unknown",
              projectId: process.env.PROJECT_ID ?? null,
              ...(utm && {
                utmSource: utm.utm_source ?? null,
                utmMedium: utm.utm_medium ?? null,
                utmCampaign: utm.utm_campaign ?? null,
                utmContent: utm.utm_content ?? null,
                utmTerm: utm.utm_term ?? null,
                fbclid: utm.fbclid ?? null,
              }),
            },
          });
          // Save to funnel step 3 table
          await prisma.$executeRaw`
            INSERT INTO "step 3" (email, name, phone)
            VALUES (${email}, ${name}, ${phone})
          `;
        }
      } catch (err) {
        console.error("Failed to save lead to database:", err);
      }
    }

    // Send notification to the business
    await resend.emails.send({
      from: `Dotazník <dotaznik@${SENDER_DOMAIN}>`,
      to: NOTIFICATION_TO,
      subject: `🔔 Nový lead: ${name}`,
      html: businessEmail(name, email, phone),
    });

    // Send confirmation to the client
    await resend.emails.send({
      from: `${BRAND_NAME} <info@${SENDER_DOMAIN}>`,
      to: email,
      subject: `Ďakujeme za Váš záujem! 🚀`,
      html: clientEmail(name, phone),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Nepodarilo sa odoslať e-mail." },
      { status: 500 }
    );
  }
}
