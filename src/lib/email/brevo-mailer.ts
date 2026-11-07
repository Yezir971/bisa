import type { InvitableUserRole } from "@/lib/validations/jira-schema";
import { ROLE_METADATA } from "@/domain/services/rbac";

export const BREVO_SMTP_API_URL = "https://api.brevo.com/v3/smtp/email";

export interface SendBrevoInvitationParams {
  recipientName: string;
  recipientEmail: string;
  department: string;
  role: InvitableUserRole;
  inviterName: string;
  workspaceName: string;
  temporaryPassword?: string;
  appUrl?: string;
}

export interface BrevoEmailPayload {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    name: string;
    email: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent: string;
  tags: string[];
}

export interface BrevoInvitationResult {
  sent: boolean;
  provider: "BREVO";
  mode: "LIVE" | "SIMULATED_NO_API_KEY" | "API_ERROR";
  messageId: string;
  recipientEmail: string;
  error?: string;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Construit le payload JSON conforme à l'API Transactionnelle Brevo (v3/smtp/email).
 */
export function buildBrevoInvitationPayload(
  params: SendBrevoInvitationParams,
  senderConfig?: { senderName?: string; senderEmail?: string }
): BrevoEmailPayload {
  const senderName =
    senderConfig?.senderName ||
    process.env.BREVO_SENDER_NAME ||
    "Bisa Workspace";
  const senderEmail =
    senderConfig?.senderEmail ||
    process.env.BREVO_SENDER_EMAIL ||
    "invitations@bisa-workspace.fr";
  const appUrl =
    params.appUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const tempPassword = params.temporaryPassword || "Bisa2026!";
  const roleMeta = ROLE_METADATA[params.role];

  const subject = `Invitation à rejoindre ${params.workspaceName} (${roleMeta.label})`;

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background-color:#f8fafc;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
          <div style="font-size:12px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;">
            ${escapeHtml(params.workspaceName)}
          </div>
          <h1 style="margin:6px 0 0;font-size:18px;font-weight:700;color:#0f172a;">
            Invitation à rejoindre l'espace de travail
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;font-size:14px;line-height:1.6;">
          <p style="margin:0 0 14px;">Bonjour <strong>${escapeHtml(params.recipientName)}</strong>,</p>
          <p style="margin:0 0 16px;">
            <strong>${escapeHtml(params.inviterName)}</strong> vous invite à rejoindre l'espace de gestion de projet <strong>${escapeHtml(params.workspaceName)}</strong> au sein de l'équipe <strong>${escapeHtml(params.department)}</strong>.
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:0 0 18px;">
            <div style="font-size:12px;color:#64748b;margin-bottom:4px;">Rôle attribué :</div>
            <div style="font-size:14px;font-weight:700;color:#4f46e5;margin-bottom:6px;">
              ${escapeHtml(roleMeta.label)}
            </div>
            <div style="font-size:12px;color:#475569;">
              ${escapeHtml(roleMeta.description)}
            </div>
          </div>
          <div style="background:#f1f5f9;border-radius:8px;padding:14px 16px;margin:0 0 20px;font-size:13px;">
            <div><strong>Identifiant (E-mail) :</strong> <code style="font-family:monospace;">${escapeHtml(params.recipientEmail)}</code></div>
            <div style="margin-top:6px;"><strong>Mot de passe temporaire :</strong> <code style="font-family:monospace;font-weight:700;">${escapeHtml(tempPassword)}</code></div>
          </div>
          <p style="margin:0 0 20px;">
            <a href="${escapeHtml(appUrl)}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:8px;">
              Accéder à ${escapeHtml(params.workspaceName)}
            </a>
          </p>
          <p style="margin:0;font-size:12px;color:#64748b;">
            E-mail transactionnel envoyé via Brevo pour ${escapeHtml(params.workspaceName)}.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textContent = [
    `Bonjour ${params.recipientName},`,
    "",
    `${params.inviterName} vous invite à rejoindre l'espace ${params.workspaceName} (${params.department}).`,
    `Rôle attribué : ${roleMeta.label}`,
    `Identifiant : ${params.recipientEmail}`,
    `Mot de passe temporaire : ${tempPassword}`,
    `Connexion : ${appUrl}`,
  ].join("\n");

  return {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        name: params.recipientName,
        email: params.recipientEmail,
      },
    ],
    subject,
    htmlContent,
    textContent,
    tags: ["workspace-invitation", `role-${params.role.toLowerCase()}`],
  };
}

/**
 * Envoie l'e-mail d'invitation via l'API Transactionnelle Brevo (POST https://api.brevo.com/v3/smtp/email).
 * Utilise la variable d'environnement BREVO_API_KEY.
 */
export async function sendBrevoInvitationEmail(
  params: SendBrevoInvitationParams,
  options?: {
    apiKey?: string;
    fetchImpl?: typeof fetch;
  }
): Promise<BrevoInvitationResult> {
  const apiKey = (options?.apiKey ?? process.env.BREVO_API_KEY ?? "").trim();
  const payload = buildBrevoInvitationPayload(params);

  if (!apiKey) {
    return {
      sent: false,
      provider: "BREVO",
      mode: "SIMULATED_NO_API_KEY",
      messageId: `<brevo-sim-${Date.now()}@bisa-workspace.local>`,
      recipientEmail: params.recipientEmail,
      error:
        "Clé BREVO_API_KEY non renseignée dans l'environnement : l'invitation a été créée et l'e-mail Brevo a été préparé en mode local.",
    };
  }

  const fetchFn = options?.fetchImpl ?? fetch;

  try {
    const response = await fetchFn(BREVO_SMTP_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const errJson = (await response.json()) as { message?: string };
        if (errJson?.message) detail = errJson.message;
      } catch {
        // Ignorer si la réponse d'erreur n'est pas du JSON
      }
      return {
        sent: false,
        provider: "BREVO",
        mode: "API_ERROR",
        messageId: "",
        recipientEmail: params.recipientEmail,
        error: `Erreur Brevo API : ${detail}`,
      };
    }

    const data = (await response.json()) as { messageId?: string };
    return {
      sent: true,
      provider: "BREVO",
      mode: "LIVE",
      messageId: data.messageId || `<brevo-${Date.now()}@smtp-relay.mailin.fr>`,
      recipientEmail: params.recipientEmail,
    };
  } catch (err) {
    return {
      sent: false,
      provider: "BREVO",
      mode: "API_ERROR",
      messageId: "",
      recipientEmail: params.recipientEmail,
      error:
        err instanceof Error
          ? `Échec d'appel Brevo : ${err.message}`
          : "Échec réseau lors de l'envoi via Brevo.",
    };
  }
}
