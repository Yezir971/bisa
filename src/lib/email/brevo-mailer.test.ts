import { describe, expect, it, vi } from "vitest";
import {
  BREVO_SMTP_API_URL,
  buildBrevoInvitationPayload,
  sendBrevoInvitationEmail,
} from "./brevo-mailer";

describe("Brevo Transactional Invitation Mailer", () => {
  it("construit un payload Brevo conforme avec l'expéditeur, le destinataire, le rôle choisi et le contenu HTML/texte", () => {
    const payload = buildBrevoInvitationPayload(
      {
        recipientName: "Claire Fontaine",
        recipientEmail: "claire.fontaine@bisa.fr",
        department: "Marketing & Produit",
        role: "VIEWER",
        inviterName: "Camille Laurent",
        workspaceName: "Bisa Technologies",
      },
      {
        senderName: "Bisa Workspace",
        senderEmail: "invitations@bisa.fr",
      }
    );

    expect(payload.sender.email).toBe("invitations@bisa.fr");
    expect(payload.to[0]?.email).toBe("claire.fontaine@bisa.fr");
    expect(payload.subject).toContain("Bisa Technologies");
    expect(payload.subject).toContain("Visiteur");
    expect(payload.htmlContent).toContain("Claire Fontaine");
    expect(payload.htmlContent).toContain("Camille Laurent");
    expect(payload.htmlContent).toContain("Bisa2026!");
    expect(payload.tags).toContain("role-viewer");
  });

  it("envoie l'e-mail d'invitation via POST https://api.brevo.com/v3/smtp/email avec l'en-tête api-key lorsque BREVO_API_KEY est défini", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ messageId: "<20261107.brevo.123@smtp-relay.mailin.fr>" }),
    });

    const result = await sendBrevoInvitationEmail(
      {
        recipientName: "Marc Vasseur",
        recipientEmail: "marc.vasseur@bisa.fr",
        department: "Ingénierie",
        role: "EDITOR",
        inviterName: "Camille Laurent",
        workspaceName: "Bisa Technologies",
      },
      {
        apiKey: "xkeysib-test-api-key-999",
        fetchImpl: mockFetch as unknown as typeof fetch,
      }
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      BREVO_SMTP_API_URL,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "api-key": "xkeysib-test-api-key-999",
          "content-type": "application/json",
        }),
      })
    );
    expect(result.sent).toBe(true);
    expect(result.provider).toBe("BREVO");
    expect(result.mode).toBe("LIVE");
    expect(result.messageId).toBe("<20261107.brevo.123@smtp-relay.mailin.fr>");
  });
});
