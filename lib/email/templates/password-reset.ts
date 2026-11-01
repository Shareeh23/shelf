import { transporter } from "@/lib/email/transporter";

type PasswordResetEmailProps = {
  name: string;
  email: string;
  url: string;
};

export async function sendPasswordResetEmail({
  name,
  email,
  url,
}: PasswordResetEmailProps) {
  await transporter.sendMail({
    from: `"Shelf" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Reset your Shelf password",

    text: `
Hello ${name},

We received a request to reset your Shelf password.

Use this link to reset your password:

${url}

If you didn't request this, you can safely ignore this email.

The Shelf Team
    `,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2>Reset your password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your Shelf password.</p>

        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#171717;color:#fff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>

        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The Shelf Team</p>
      </div>
    `,
  });
}
