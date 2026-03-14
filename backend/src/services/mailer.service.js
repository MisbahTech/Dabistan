import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transport = null

function ensureTransport() {
  if (transport) {
    return transport
  }

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    throw new Error('SMTP is not configured')
  }

  transport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })

  return transport
}

export async function sendMail({ to, subject, text, html }) {
  const transporter = ensureTransport()
  const from = env.smtpFrom || env.smtpUser
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}
