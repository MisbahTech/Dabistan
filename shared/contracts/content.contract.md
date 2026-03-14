# Shared Content Contract

This file documents the data contract used between frontend and backend.

## Section

```json
{
  "slug": "string",
  "title": "string",
  "description": "string",
  "articles": [{ "title": "string", "excerpt": "string", "href": "string" }],
  "gallery": ["string"],
  "videos": [{ "title": "string", "duration": "string", "url": "string" }],
  "links": [{ "label": "string", "href": "string" }]
}
```

## Book

Same shape as `Section` with book-specific `slug`, `title`, and `description`.

## Nav Link

```json
{
  "key": "string",
  "path": "string",
  "label": "string"
}
```

## Contact Link

```json
{
  "id": "string",
  "label": "string",
  "href": "string"
}
```

## Content Bundle

```json
{
  "sections": ["Section"],
  "books": ["Book"],
  "nav": ["Nav Link"],
  "contacts": ["Contact Link"]
}
```
