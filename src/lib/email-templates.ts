interface EmailData {
  firstName?: string;
  username?: string;
  resetLink?: string;
}

export function generateEmailTemplate(type: 'confirmation' | 'reset', data: EmailData): string {
  switch (type) {
    case 'confirmation':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0;">TrendPilot</h1>
            <p style="color: #666; margin-top: 5px;">AI-Powered Content Curation</p>
          </div>

          <div style="background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="margin-top: 0; color: #333;">Welcome to TrendPilot, ${data.firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Thanks for signing up! We're excited to have you on board. Please confirm your email address to get started.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{confirmationUrl}}" 
                 style="background: #6366f1; color: white; padding: 12px 24px; 
                        border-radius: 6px; text-decoration: none; display: inline-block;">
                Confirm Email Address
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">
              If you didn't create an account with TrendPilot, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} TrendPilot. All rights reserved.</p>
          </div>
        </div>
      `;

    case 'reset':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0;">TrendPilot</h1>
            <p style="color: #666; margin-top: 5px;">Password Reset Request</p>
          </div>

          <div style="background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="margin-top: 0; color: #333;">Reset Your Password</h2>
            
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password. Click the button below to choose a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetLink}" 
                 style="background: #6366f1; color: white; padding: 12px 24px; 
                        border-radius: 6px; text-decoration: none; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} TrendPilot. All rights reserved.</p>
          </div>
        </div>
      `;
  }
}