// Centralized content data used by navigation and routes.

export const sections = [
  {
    slug: 'khabarona',
    title: 'خبرونه',
    description: 'د ورځنیو مهمو پېښو تازه پوښښ او اعلانونه.',
    articles: [
      { title: 'د اوونۍ مهم خبرونه', excerpt: 'د ټولنې او ادبي ډګر تازه پېښې په لنډه بڼه.', href: '#' },
      { title: 'راتلونکې غونډې', excerpt: 'د فعاليتونو نېټې، ځای او د ګډون طريقه.', href: '#' },
      { title: 'ځوانانو نوښتونه', excerpt: 'د ځوانو لیکوالانو او څېړونکو وروستي کارونه.', href: '#' },
    ],
    gallery: ['د غونډې انځور 1', 'د غونډې انځور 2', 'د اعلان پوستر'],
    videos: [{ title: 'د اوونۍ ویډیويي لنډیز', duration: '08:24' }],
    links: [
      { label: 'ټولې خبرپاڼې', href: '#' },
      { label: 'د ګډون فورم', href: '#' },
      { label: 'ارشیف', href: '#' },
    ],
  },
  {
    slug: 'farhangi-lekane',
    title: 'فرهنګي لیکنې',
    description: 'د کلتور، ادب او ټولنیزو ارزښتونو تحلیل.',
    articles: [
      { title: 'په معاصر ادب کې نوې ژبه', excerpt: 'د نوې لیکنې سبکونه او د لوستونکو تمایل.', href: '#' },
      { title: 'محلي روایتونه', excerpt: 'د سیمې فرهنګي میراث ته نوې کتنه.', href: '#' },
      { title: 'د هنر اغېز', excerpt: 'هنر څنګه د ټولنې فکري فضا بدلوي.', href: '#' },
    ],
    gallery: ['کلتوري نندارتون', 'هنري ماښام', 'کتاب لوستنه'],
    videos: [{ title: 'فرهنګي مرکه', duration: '12:10' }],
    links: [
      { label: 'فرهنګي ارشیف', href: '#' },
      { label: 'لیکوالان', href: '#' },
      { label: 'د موضوعاتو لړ', href: '#' },
    ],
  },
  {
    slug: 'elmi-lekane',
    title: 'علمي لیکنې',
    description: 'تحقیقي مقالې، اکاډمیک یادښتونه او علمي بحثونه.',
    articles: [
      { title: 'څېړنیزه میتودولوژي', excerpt: 'د بااعتباره څېړنې لپاره بنسټیز اصول.', href: '#' },
      { title: 'د معلوماتو تحلیل', excerpt: 'د شواهدو پر بنسټ پایلې او سپارښتنې.', href: '#' },
      { title: 'اکاډمیک لیکدود', excerpt: 'په علمي متن کې ژبنی معیار او جوړښت.', href: '#' },
    ],
    gallery: ['د څېړنې ورکشاپ', 'علمي سیمینار', 'کتابتون'],
    videos: [{ title: 'علمي بحث', duration: '15:42' }],
    links: [
      { label: 'څېړنیز PDF', href: '#' },
      { label: 'ډاټا او سرچینې', href: '#' },
      { label: 'اکاډمیک لارښود', href: '#' },
    ],
  },
  {
    slug: 'dabistan-majalla',
    title: 'دبستان مجله',
    description: 'د مجلې ځانګړې ګڼه، سرمقاله او منتخبې لیکنې.',
    articles: [
      { title: 'د روانې ګڼې سرمقاله', excerpt: 'د ګڼې اصلي موضوع او تمرکز.', href: '#' },
      { title: 'منتخبې لیکنې', excerpt: 'د ګڼې تر ټولو ډېر لوستل شوي مطالب.', href: '#' },
      { title: 'لوستونکو نظرونه', excerpt: 'د لوستونکو غبرګونونه او سپارښتنې.', href: '#' },
    ],
    gallery: ['د مجلې پوښ', 'چاپي نسخه', 'ټیم غونډه'],
    videos: [{ title: 'د مجلې پېژندنه', duration: '06:58' }],
    links: [
      { label: 'ټولې ګڼې', href: '#' },
      { label: 'سبسکرایب', href: '#' },
      { label: 'ډاونلوډ', href: '#' },
    ],
  },
  {
    slug: 'dabistan-podcast',
    title: 'دبستان پاډکاسټ',
    description: 'غږیز اپیزودونه، مرکې او موضوعي لړۍ.',
    articles: [
      { title: 'تازه اپیزود', excerpt: 'د دې اوونۍ مهمه غږیزه مرکه.', href: '#' },
      { title: 'موضوعي پلی لیست', excerpt: 'هره موضوع په جلا لړۍ کې واورئ.', href: '#' },
      { title: 'د مېلمنو پېژندنه', excerpt: 'له متخصصینو او لیکوالانو سره خبرې.', href: '#' },
    ],
    gallery: ['سټوډیو', 'مېلمانه', 'غږیز تجهیزات'],
    videos: [{ title: 'ویډیو پاډکاسټ نمونه', duration: '21:35' }],
    links: [
      { label: 'Spotify لینک', href: '#' },
      { label: 'YouTube پلی لیست', href: '#' },
      { label: 'RSS Feed', href: '#' },
    ],
  },
  {
    slug: 'seerat-conference',
    title: 'د سیرت کلنی کنفرانس',
    description: 'د کنفرانس اجنډا، ویناوې او د ګډون معلومات.',
    articles: [
      { title: 'د کنفرانس اجنډا', excerpt: 'د ورځنیو ناستو بشپړ مهالویش.', href: '#' },
      { title: 'مخکینۍ ویناوې', excerpt: 'د تېر کال مهمې علمي ویناوې او مقالې.', href: '#' },
      { title: 'د ګډون لارښود', excerpt: 'آنلاین او حضوري ثبت‌نام تفصیل.', href: '#' },
    ],
    gallery: ['د کنفرانس تالار', 'د ویناوالو پینل', 'د ګډونوالو انځور'],
    videos: [{ title: 'د کنفرانس بشپړه وینا', duration: '32:10' }],
    links: [
      { label: 'ثبت‌نام', href: '#' },
      { label: 'ویناوال', href: '#' },
      { label: 'کنفرانس ارشیف', href: '#' },
    ],
  },
]

export const books = [
  {
    slug: 'talif',
    title: 'تاليف',
    description: 'اصلي لیکنې او بنسټیز کتابونه.',
    articles: [
      { title: 'نوې تالیف شوې ټولګه', excerpt: 'د ادبي او فکري مقالو نوې مجموعه.', href: '#' },
      { title: 'لیکوال پېژندنه', excerpt: 'د کتاب د لیکوال فکر او سبک.', href: '#' },
    ],
    gallery: ['د کتاب پوښ', 'د لیکوال انځور', 'د چاپ انځور'],
    videos: [{ title: 'د کتاب معرفي ویډیو', duration: '05:11' }],
    links: [
      { label: 'آنلاین لوستل', href: '#' },
      { label: 'PDF', href: '#' },
      { label: 'پېرود', href: '#' },
    ],
  },
  {
    slug: 'tehrna',
    title: 'څېړنه',
    description: 'تحقیقي کتابونه او علمي موندنې.',
    articles: [
      { title: 'میداني څېړنه', excerpt: 'د ټولنیزو موضوعاتو پر بنسټیزو ارقامو تحلیل.', href: '#' },
      { title: 'نتیجې او سپارښتنې', excerpt: 'د پالیسۍ او عملي کار لپاره وړاندیزونه.', href: '#' },
    ],
    gallery: ['څېړنیز چارټ', 'میداني کار', 'راپور'],
    videos: [{ title: 'څېړنیز پریزنټېشن', duration: '09:40' }],
    links: [
      { label: 'راپور ډاونلوډ', href: '#' },
      { label: 'ریفرنسونه', href: '#' },
      { label: 'اړوند لیکنې', href: '#' },
    ],
  },
  {
    slug: 'zbarha',
    title: 'ژباړه',
    description: 'له نورو ژبو څخه ژباړل شوي مهم اثار.',
    articles: [
      { title: 'نوې ژباړه', excerpt: 'نړیوال فکرونه په روانه پښتو ژبه.', href: '#' },
      { title: 'ژباړن سره مرکه', excerpt: 'د ژباړې ستونزې او حل لارې.', href: '#' },
    ],
    gallery: ['اصل کتاب', 'ژباړل شوې نسخه', 'ژباړن'],
    videos: [{ title: 'د ژباړې بهیر', duration: '07:55' }],
    links: [
      { label: 'کتاب کتنه', href: '#' },
      { label: 'د ژباړن پروفایل', href: '#' },
      { label: 'نور ژباړل شوي کتابونه', href: '#' },
    ],
  },
  {
    slug: 'mukhtana',
    title: 'مخکتنه',
    description: 'د چاپ څخه مخکې د کتابونو پېژندنه.',
    articles: [
      { title: 'راتلونکی کتاب', excerpt: 'د موضوع، فصلونو او موخې لنډه پېژندنه.', href: '#' },
      { title: 'د لیکوال خبرې', excerpt: 'کتاب ولې لیکل شوی او چا ته ګټه رسوي.', href: '#' },
    ],
    gallery: ['لومړنی مسوده', 'ایډیټ غونډه', 'ډیزاین نمونه'],
    videos: [{ title: 'مخکتنې ویډیو', duration: '04:46' }],
    links: [
      { label: 'د مخکتنې فایل', href: '#' },
      { label: 'نظر ورکړئ', href: '#' },
      { label: 'د خپرېدو نېټه', href: '#' },
    ],
  },
  {
    slug: 'stainaghonda',
    title: 'ستاینغونډه',
    description: 'د کتابونو د معرفۍ او ستاینې ځانګړې غونډې.',
    articles: [
      { title: 'د ستاینغونډې راپور', excerpt: 'د غونډې مهمې ویناوې او ګډونوال.', href: '#' },
      { title: 'د کتاب اغېز', excerpt: 'کتاب په ټولنه کې کوم بدلون راوستی؟', href: '#' },
    ],
    gallery: ['غونډه', 'د کتاب مخکتنه', 'ویناوال'],
    videos: [{ title: 'د ستاینغونډې ثبت', duration: '18:02' }],
    links: [
      { label: 'غونډې انځورونه', href: '#' },
      { label: 'وینا بشپړ متن', href: '#' },
      { label: 'راتلونکې غونډه', href: '#' },
    ],
  },
]

export const contactLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18VkPvg8kn/',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/Dabistan011',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/Dabistan011',
  },
]

export const contentCollections = [
  {
    // Primary sections shown at root level: /:slug
    key: 'sections',
    basePath: '',
    items: sections,
  },
  {
    // Book subsections shown under /books/:slug
    key: 'books',
    basePath: 'books',
    items: books,
  },
]

