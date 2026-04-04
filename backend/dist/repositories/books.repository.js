import { Book } from '../models/Book.js';
import { getNextId } from '../utils/counter.js';
import { toSearchRegex } from '../utils/mongo.js';
export async function listBooks(options = {}) {
    const filter = {};
    if (options.sectionSlug) {
        filter.section_slug = options.sectionSlug;
    }
    if (options.q) {
        const regex = toSearchRegex(options.q);
        if (regex) {
            filter.$or = [{ title: regex }, { description: regex }, { slug: regex }];
        }
    }
    let query = Book.find(filter).sort({ id: 1 }).lean();
    if (options.offset)
        query = query.skip(options.offset);
    if (options.limit)
        query = query.limit(options.limit);
    const data = await query;
    if (options.withTotal) {
        const total = await Book.countDocuments(filter);
        return { data, total };
    }
    return data;
}
export async function getBookById(id) {
    return Book.findOne({ id }).lean();
}
export async function getBookBySlug(slug) {
    return Book.findOne({ slug }).lean();
}
export async function createBook({ title, slug, description }) {
    const id = await getNextId('books');
    const book = await Book.create({
        id,
        title,
        slug,
        description,
    });
    return book.toJSON();
}
export async function updateBook(id, data) {
    return Book.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean();
}
export async function deleteBook(id) {
    return Book.findOneAndDelete({ id }).lean();
}
//# sourceMappingURL=books.repository.js.map