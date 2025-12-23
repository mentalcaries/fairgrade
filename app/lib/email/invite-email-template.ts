export const inviteEmailHtml = (name: string, loginRoute: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #00bc7d; padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">FairGrade</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">You've been added to FairGrade</h2>
          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
            Hi ${name},
          </p>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
            You've been added to FairGrade for clinical rotation assessments. Click the button below to access your account using this email address.
          </p>
          
          <!-- Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.BASE_URL}/${loginRoute}" style="display: inline-block; padding: 14px 32px; background-color: #00bc7d; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Access Your Account
            </a>
          </div>
          
          <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
            Use this email address to sign in.
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} Full Stack Collective.
          </p>
          <p style="color: #9ca3af; font-size: 12px;">Built with ❤️ in 🇹🇹</p>
        </div>
        
      </div>
    </body>
  </html>
`;