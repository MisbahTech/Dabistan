import { isValidObjectId } from 'mongoose';
import { Category } from '../models/Category.js';
import { createHttpError, requireFields } from '../utils/http.js';
import { slugify } from '../utils/slugify.js';
async function findCategoryByIdentifier(rawIdentifier) {
    const identifier = (rawIdentifier ?? '').trim();
    if (!identifier || identifier === 'undefined' || identifier === 'null') {
        throw createHttpError(400, 'Invalid category identifier');
    }
    if (isValidObjectId(identifier)) {
        const byObjectId = await Category.findById(identifier);
        if (byObjectId)
            return byObjectId;
    }
    const numeric = Number(identifier);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
        const byNumericId = await Category.findOne({ id: numeric });
        if (byNumericId)
            return byNumericId;
    }
    return Category.findOne({ slug: identifier });
}
export async function listCategories(req, res, next) {
    try {
        const q = (req.query.q ?? '').trim();
        const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') }] } : {};
        const categories = await Category.find(filter).sort({ name: 1 });
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
}
export async function listPublicCategories(_req, res, next) {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
}
export async function createCategory(req, res, next) {
    try {
        const { name, slug, description } = (req.body ?? {});
        requireFields({ name }, ['name']);
        const finalSlug = slug ? slugify(slug) : slugify(name);
        const existing = await Category.findOne({ slug: finalSlug });
        if (existing) {
            throw createHttpError(409, 'Slug already exists');
        }
        const category = await Category.create({
            name,
            slug: finalSlug,
            description: description ?? '',
        });
        res.status(201).json(category);
    }
    catch (error) {
        next(error);
    }
}
export async function updateCategory(req, res, next) {
    try {
        const { name, slug, description } = (req.body ?? {});
        requireFields({ name }, ['name']);
        const category = await findCategoryByIdentifier(req.params.id);
        if (!category) {
            throw createHttpError(404, 'Category not found');
        }
        const finalSlug = slug ? slugify(slug) : slugify(name);
        if (finalSlug !== category.slug) {
            const existing = await Category.findOne({ slug: finalSlug });
            if (existing) {
                throw createHttpError(409, 'Slug already exists');
            }
        }
        category.name = name;
        category.slug = finalSlug;
        category.description = description ?? '';
        await category.save();
        res.json(category);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteCategory(req, res, next) {
    try {
        const category = await findCategoryByIdentifier(req.params.id);
        if (!category) {
            throw createHttpError(404, 'Category not found');
        }
        await category.deleteOne();
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=categories.controller.js.map