import { Facebook, Mail, MessageCircle, Twitter } from 'lucide-react'

const PASHTO_COPYRIGHT = '\u00a9 \u062F\u0628\u0633\u062A\u0627\u0646 - \u067C\u0648\u0644 \u062D\u0642\u0648\u0646\u0647 \u062E\u0648\u0646\u062F\u064A \u062F\u064A.'
const PASHTO_CONTACT = '\u0627\u0693\u06CC\u06A9\u06D0'

const links = [
  {
    id: 'whatsapp',
    href: 'https://chat.whatsapp.com/ChegAYGvkOMLmeJ9lDs6u9',
    label: 'WhatsApp',
    Icon: MessageCircle,
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/share/18VkPvg8kn/',
    label: 'Facebook',
    Icon: Facebook,
  },
  {
    id: 'x',
    href: 'https://x.com/Dabistan011',
    label: 'Twitter/X',
    Icon: Twitter,
  },
  {
    id: 'email',
    href: 'mailto:Dabistan011@gmail.com',
    label: 'Email',
    Icon: Mail,
  },
]

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-container public-footer-inner">
        <p>{PASHTO_COPYRIGHT}</p>
        <div className="footer-contact">
          <span>{PASHTO_CONTACT}</span>
          <div className="footer-icons">
            {links.map(({ id, href, label, Icon }) => (
              <a key={id} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

