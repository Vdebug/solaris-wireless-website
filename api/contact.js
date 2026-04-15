const { google } = require('googleapis');

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return auth;
}

async function sendEmail({ to, subject, html }) {
  const gmail = google.gmail({ version: 'v1', auth: getAuth() });
  const from = `"Solaris Wireless" <${process.env.GMAIL_USER}>`;
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\r\n');

  const raw = Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
}

async function logToSheet(d) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        d.firstName,
        d.lastName,
        d.organisation,
        d.email,
        d.interest,
        d.message,
        'New',
      ]],
    },
  });
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function clean(s) {
  return typeof s === 'string' ? s.replace(/[<>]/g, '').trim() : '';
}

// ── Auto-reply to the lead ────────────────────────────────────────────────
function leadReplyHtml(d) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F9FC;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FC;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:#0F1C2E;padding:32px 40px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;vertical-align:middle">
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="7" fill="#F5C200"/>
                    <g stroke="#F5C200" stroke-width="2" stroke-linecap="round">
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/>
                      <line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/>
                      <line x1="5.5" y1="5.5" x2="8.3" y2="8.3"/><line x1="23.7" y1="23.7" x2="26.5" y2="26.5"/>
                      <line x1="26.5" y1="5.5" x2="23.7" y2="8.3"/><line x1="8.3" y1="23.7" x2="5.5" y2="26.5"/>
                    </g>
                  </svg>
                </td>
                <td style="vertical-align:middle">
                  <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.08em">SOLARIS</span>
                  <span style="color:rgba(255,255,255,0.5);font-size:20px;font-weight:400;letter-spacing:0.08em"> WIRELESS</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Gold bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#C49A1A,#F5C200)"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px">
            <h1 style="margin:0 0 16px;font-size:26px;font-weight:400;color:#0F1C2E;font-family:Georgia,'Times New Roman',serif;line-height:1.3">
              Thank you, ${d.firstName}.
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#4A5568;line-height:1.75">
              We have received your enquiry and a member of the Solaris Wireless team will be in touch within <strong>one business day</strong>.
            </p>

            <!-- Summary card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FC;border:1px solid #E2E8F0;border-radius:6px;margin:24px 0">
              <tr><td style="padding:20px 24px">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#A0AEC0">Your Enquiry</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size:13px;color:#718096;padding:5px 0;width:130px;vertical-align:top">Area of Interest</td>
                    <td style="font-size:13px;color:#2D3748;padding:5px 0;font-weight:500">${d.interest}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#718096;padding:5px 0;vertical-align:top">Organisation</td>
                    <td style="font-size:13px;color:#2D3748;padding:5px 0">${d.organisation}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 16px;font-size:15px;color:#4A5568;line-height:1.75">
              In the meantime, here is what Solaris Wireless offers:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="padding:0 8px 0 0;vertical-align:top">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E8F0;border-radius:6px;border-top:3px solid #C49A1A">
                    <tr><td style="padding:16px">
                      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0F1C2E">Supply</p>
                      <p style="margin:0;font-size:12px;color:#718096;line-height:1.6">Global sourcing across 4 continents - mobile, laptops, IoT, Starlink and more.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:0 4px;vertical-align:top">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E8F0;border-radius:6px;border-top:3px solid #C49A1A">
                    <tr><td style="padding:16px">
                      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0F1C2E">Provisioning</p>
                      <p style="margin:0;font-size:12px;color:#718096;line-height:1.6">OS flashing, SIM lock, carrier branding - every unit ready to activate.</p>
                    </td></tr>
                  </table>
                </td>
                <td width="33%" style="padding:0 0 0 8px;vertical-align:top">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E8F0;border-radius:6px;border-top:3px solid #C49A1A">
                    <tr><td style="padding:16px">
                      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0F1C2E">Fulfilment</p>
                      <p style="margin:0;font-size:12px;color:#718096;line-height:1.6">Direct-to-customer delivery, kitting and retail packaging worldwide.</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:28px 0 0;font-size:15px;color:#0F1C2E;font-weight:500">The Solaris Wireless Team</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0F1C2E;padding:24px 40px">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.8">
              Solaris Wireless - Institutional Technology Supply<br>
              Miami, Florida &nbsp;&middot;&nbsp; Netherlands &nbsp;&middot;&nbsp; Dubai &nbsp;&middot;&nbsp; Hong Kong &nbsp;&middot;&nbsp; Singapore
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Notification to Vasu ───────────────────────────────────────────────────
function notifyHtml(d) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F9FC;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FC;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">
        <tr><td style="background:#0F1C2E;padding:24px 32px">
          <span style="color:#F5C200;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">New Lead - Solaris Wireless</span>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,#C49A1A,#F5C200)"></td></tr>
        <tr><td style="padding:32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:6px">
            <tr style="background:#F7F9FC"><td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#A0AEC0" colspan="2">Lead Details</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:#718096;border-top:1px solid #E2E8F0;width:140px">Name</td><td style="padding:10px 16px;font-size:13px;color:#2D3748;font-weight:600;border-top:1px solid #E2E8F0">${d.firstName} ${d.lastName}</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:#718096;border-top:1px solid #E2E8F0">Email</td><td style="padding:10px 16px;font-size:13px;color:#2D3748;border-top:1px solid #E2E8F0"><a href="mailto:${d.email}" style="color:#C49A1A">${d.email}</a></td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:#718096;border-top:1px solid #E2E8F0">Organisation</td><td style="padding:10px 16px;font-size:13px;color:#2D3748;border-top:1px solid #E2E8F0">${d.organisation}</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:#718096;border-top:1px solid #E2E8F0">Interest</td><td style="padding:10px 16px;font-size:13px;color:#2D3748;border-top:1px solid #E2E8F0">${d.interest}</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:#718096;border-top:1px solid #E2E8F0;vertical-align:top">Message</td><td style="padding:10px 16px;font-size:13px;color:#2D3748;border-top:1px solid #E2E8F0;line-height:1.6">${d.message}</td></tr>
          </table>
          <p style="margin:24px 0 0;text-align:center">
            <a href="${sheetUrl}" style="display:inline-block;background:#C49A1A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.05em">View in Google Sheet</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Vercel serverless handler ─────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { firstName, lastName, organisation, email, interest, message } = req.body || {};

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const d = {
      firstName:    clean(firstName),
      lastName:     clean(lastName),
      organisation: clean(organisation) || 'Not provided',
      email:        clean(email),
      interest:     clean(interest) || 'Not specified',
      message:      clean(message),
    };

    // Run all three operations in parallel
    await Promise.all([
      logToSheet(d),
      sendEmail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New lead: ${d.firstName} ${d.lastName} - ${d.interest}`,
        html: notifyHtml(d),
      }),
      sendEmail({
        to: d.email,
        subject: `Thank you for contacting Solaris Wireless, ${d.firstName}`,
        html: leadReplyHtml(d),
      }),
    ]);

    console.log(`[${new Date().toISOString()}] Lead: ${d.firstName} ${d.lastName} <${d.email}>`);
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact error:', err.message, err.stack);
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
};
