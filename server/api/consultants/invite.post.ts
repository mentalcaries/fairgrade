import { resend } from "~/lib/email/email-client";
import { inviteEmailHtml } from "~/lib/email/invite-email-template"

export default defineEventHandler(async (event) => {
  const { email, name } = await readBody(event);
  const LOGIN_ROUTE = '/login';

  await resend.emails.send({
    from: 'FairGrade Assessments <no-reply@verify.fscx.cloud>',
    to: email,
    subject: "You've been added to FairGrade",
    html: inviteEmailHtml(name, LOGIN_ROUTE),
  });

  return { success: true };
});
