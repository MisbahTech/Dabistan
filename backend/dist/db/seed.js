import { connectDb, disconnectDb } from './mongoose.js';
import { ensureAdminUser } from '../utils/seedAdmin.js';
import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Video } from '../models/Video.js';
import { MostRead } from '../models/MostRead.js';
import { Weather } from '../models/Weather.js';
import { ExchangeRate } from '../models/ExchangeRate.js';
import { getNextId } from '../utils/counter.js';
async function seed() {
    await connectDb();
    await ensureAdminUser();
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.warn('No admin found; skipping content seed.');
        return;
    }
    const categoryCount = await Category.countDocuments();
    if (!categoryCount) {
        console.log('Seeding categories...');
        const categories = [
            { name: 'Afghanistan', slug: 'afghanistan', description: 'Local updates and reports.' },
            { name: 'World', slug: 'world', description: 'Global news and events.' },
            { name: 'Economy', slug: 'economy', description: 'Business and financial updates.' },
            { name: 'Culture', slug: 'culture', description: 'Arts, media, and culture.' },
        ];
        for (const cat of categories) {
            const id = await getNextId('categories');
            await Category.create({ ...cat, id });
        }
    }
    const postCount = await Post.countDocuments();
    if (!postCount) {
        console.log('Seeding posts...');
        const posts = [
            {
                title: 'Welcome to Dabistan',
                slug: 'welcome-to-dabistan',
                content: 'This is your first post. Edit or delete it from the dashboard.',
                excerpt: 'This is your first post.',
                category: 'afghanistan',
                section_slug: 'news',
                image: 'https://placehold.co/1200x630',
                status: 'published',
                author: admin.name,
                published_at: new Date(),
            },
            {
                title: 'Editorial Workflow Overview',
                slug: ' editorial-workflow-overview',
                content: 'Use drafts to collaborate and publish once approved.',
                excerpt: 'Best practices for editors and admins.',
                category: 'culture',
                section_slug: 'articles',
                image: 'https://placehold.co/1200x630',
                status: 'draft',
                author: admin.name,
                published_at: null,
            },
        ];
        for (const post of posts) {
            const id = await getNextId('posts');
            await Post.create({ ...post, id });
        }
    }
    const videoCount = await Video.countDocuments();
    if (!videoCount) {
        console.log('Seeding videos...');
        const videos = [
            {
                title: 'Dabistan Weekly Briefing',
                url: 'https://example.com/videos/weekly-briefing',
                thumbnail: 'https://placehold.co/640x360',
                category: 'world',
                duration: '06:20',
                description: 'Highlights from the week.',
                published_at: new Date(),
            },
            {
                title: 'Afghanistan Economy',
                url: 'https://example.com/videos/afg-economy',
                thumbnail: 'https://placehold.co/640x360',
                category: 'economy',
                duration: '04:10',
                description: 'Economic update and insights.',
                published_at: new Date(),
            },
        ];
        for (const video of videos) {
            const id = await getNextId('videos');
            await Video.create({ ...video, id });
        }
    }
    const mostReadCount = await MostRead.countDocuments();
    if (!mostReadCount) {
        console.log('Seeding most read...');
        const mostRead = [
            {
                title: 'Top Story: Regional Updates',
                slug: 'top-story-regional-updates',
                category: 'afghanistan',
                rank: 1,
                published_at: new Date(),
            },
            {
                title: 'Global Markets Snapshot',
                slug: 'global-markets-snapshot',
                category: 'economy',
                rank: 2,
                published_at: new Date(),
            },
        ];
        for (const mr of mostRead) {
            const id = await getNextId('most-read');
            await MostRead.create({ ...mr, id });
        }
    }
    const weatherCount = await Weather.countDocuments();
    if (!weatherCount) {
        console.log('Seeding weather...');
        const weatherData = [
            { location: 'Kabul', temperature: 18, condition: 'Partly cloudy', icon: 'cloudy' },
            { location: 'Herat', temperature: 21, condition: 'Clear', icon: 'sunny' },
        ];
        for (const w of weatherData) {
            const id = await getNextId('weather');
            await Weather.create({ ...w, id });
        }
    }
    const exchangeCount = await ExchangeRate.countDocuments();
    if (!exchangeCount) {
        console.log('Seeding exchange rates...');
        const exchangeRates = [
            { base: 'AFN', currency: 'USD', rate: 0.014, flag: '🇺🇸' },
            { base: 'AFN', currency: 'EUR', rate: 0.013, flag: '🇪🇺' },
        ];
        for (const er of exchangeRates) {
            const id = await getNextId('exchange-rates');
            await ExchangeRate.create({ ...er, id });
        }
    }
}
seed()
    .then(async () => {
    await disconnectDb();
    console.log('Seed complete');
})
    .catch(async (error) => {
    console.error('Seed error:', error);
    await disconnectDb();
    process.exitCode = 1;
});
//# sourceMappingURL=seed.js.map