# Swagger Documentation Guide

## File Structure Explanation

Each Swagger documentation file follows this pattern:

```typescript
/**
 * @swagger
 * /api/v1/your-endpoint:     ← The full API path
 *   http-method:              ← GET, POST, PUT, DELETE, etc.
 *     summary: Description    ← Short description shown in Swagger UI
 *     tags: [TagName]        ← Groups endpoints together
 *     requestBody:            ← Only for POST/PUT/PATCH
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [field1, field2]  ← Required fields
 *             properties:
 *               field1:                   ← Request body fields
 *                 type: string
 *                 example: "value"
 *     parameters:             ← For URL params (?id=123) or path params (/:id)
 *       - in: path           ← or "query" for query params
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:                 ← HTTP status code
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'  ← Reusable schema
 */

```

## Quick Reference

### Available Reusable Schemas (No need to write these!)
- `$ref: '#/components/schemas/APIResponse'` - For success responses
- `$ref: '#/components/schemas/ErrorResponse'` - For error responses

### Common HTTP Methods
- `get:` - Read data
- `post:` - Create data
- `put:` - Update data (full update)
- `patch:` - Update data (partial update)
- `delete:` - Delete data

### Common Types
- `type: string` - Text
- `type: number` - Numbers
- `type: boolean` - true/false
- `type: array` - Lists
- `type: object` - Objects

### Example Templates

#### GET Endpoint (with path parameter)
```typescript
/**
 * @swagger
 * /api/v1/url/{id}:
 *   get:
 *     summary: Get URL by ID
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
```

#### POST Endpoint (with request body)
```typescript
/**
 * @swagger
 * /api/v1/url:
 *   post:
 *     summary: Create a new URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
```

#### PUT/PATCH Endpoint
```typescript
/**
 * @swagger
 * /api/v1/url/{id}:
 *   put:
 *     summary: Update URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
```

#### DELETE Endpoint
```typescript
/**
 * @swagger
 * /api/v1/url/{id}:
 *   delete:
 *     summary: Delete URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
```

## Tips

1. **Use $ref for responses** - Don't write full response schemas, use `APIResponse` or `ErrorResponse`
2. **Copy existing endpoints** - Start with a similar endpoint and modify
3. **Tags group endpoints** - Use consistent tags like `[URLs]`, `[Users]`, etc.
4. **Examples help** - Always include `example:` values for better documentation
