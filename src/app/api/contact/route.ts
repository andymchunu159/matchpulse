import { NextResponse } from "next/server";
import { Resend } from "resend";

const CAPTCHA_VALUE = "MatchPulse";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    /* ============================================================
       ENVIRONMENT VALIDATION
       ============================================================ */

    const apiKey =
      process.env.RESEND_API_KEY;

    const contactEmail =
      process.env.CONTACT_EMAIL;

    const fromEmail =
      process.env.CONTACT_FROM_EMAIL;

    if (
      !apiKey ||
      !contactEmail ||
      !fromEmail
    ) {
      console.error(
        "Contact API: Missing email environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Contact service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    /* ============================================================
       READ REQUEST
       ============================================================ */

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const captcha =
      typeof body.captcha === "string"
        ? body.captcha.trim()
        : "";

    /* ============================================================
       REQUIRED FIELDS
       ============================================================ */

    if (
      !name ||
      !email ||
      !subject ||
      !message ||
      !captcha
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       CAPTCHA
       ============================================================ */

    if (captcha !== CAPTCHA_VALUE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Captcha verification failed.",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       EMAIL VALIDATION
       ============================================================ */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       LENGTH VALIDATION
       ============================================================ */

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is too long.",
        },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is too long.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject is too long.",
        },
        { status: 400 }
      );
    }

    if (
      message.length < 10
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message must contain at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message is too long.",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       SEND EMAIL
       ============================================================ */

    const { data, error } =
      await resend.emails.send({
        from: `MatchPulse Contact <${fromEmail}>`,
        to: [contactEmail],
        replyTo: email,
        subject: `[MatchPulse Contact] ${subject}`,

        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>MatchPulse Contact</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #09090b;
                color: #e4e4e7;
                font-family: Arial, Helvetica, sans-serif;
              "
            >

              <div
                style="
                  max-width: 640px;
                  margin: 40px auto;
                  padding: 32px;
                  background: #18181b;
                  border: 1px solid #27272a;
                  border-radius: 16px;
                "
              >

                <h1
                  style="
                    margin: 0 0 8px;
                    color: #4ade80;
                    font-size: 24px;
                  "
                >
                  MatchPulse Contact
                </h1>

                <p
                  style="
                    margin: 0 0 28px;
                    color: #71717a;
                    font-size: 14px;
                  "
                >
                  New message received from the MatchPulse website.
                </p>

                <div
                  style="
                    padding: 20px;
                    background: #09090b;
                    border-radius: 12px;
                  "
                >

                  <p>
                    <strong style="color: #4ade80;">
                      Name
                    </strong>
                    <br />
                    ${escapeHtml(name)}
                  </p>

                  <p>
                    <strong style="color: #4ade80;">
                      Email
                    </strong>
                    <br />
                    ${escapeHtml(email)}
                  </p>

                  <p>
                    <strong style="color: #4ade80;">
                      Subject
                    </strong>
                    <br />
                    ${escapeHtml(subject)}
                  </p>

                  <p>
                    <strong style="color: #4ade80;">
                      Message
                    </strong>
                    <br />
                    ${escapeHtml(message).replace(
                      /\n/g,
                      "<br />"
                    )}
                  </p>

                </div>

                <p
                  style="
                    margin-top: 28px;
                    color: #52525b;
                    font-size: 12px;
                  "
                >
                  Sent from the MatchPulse Contact page.
                </p>

              </div>

            </body>
          </html>
        `,

        text: `
MatchPulse Contact

Name:
${name}

Email:
${email}

Subject:
${subject}

Message:
${message}
        `,
      });

    /* ============================================================
       RESEND ERROR
       ============================================================ */

    if (error) {
      console.error(
        "Resend Contact Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to send your message right now. Please try again later.",
        },
        { status: 500 }
      );
    }

    /* ============================================================
       SUCCESS
       ============================================================ */

    console.log(
      "MatchPulse contact email sent:",
      data?.id
    );

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "Contact API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending your message.",
      },
      { status: 500 }
    );
  }
}

/* ================================================================
   HTML ESCAPING
   ================================================================ */

function escapeHtml(
  value: string
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}