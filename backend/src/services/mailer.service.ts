import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transport: nodemailer.Transporter | null = null

export function isMailConfigured(): boolean {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass)
}

function ensureTransport(): nodemailer.Transporter {
  if (transport) {
    return transport
  }

  if (!isMailConfigured()) {
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

export interface SendMailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendMail({ to, subject, text, html }: SendMailOptions): Promise<any> {
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
