/**
* @swagger
 * /api/v1/url:
 *   post:                                    # ← Change: post/get/put/delete
 *     summary: Create a new URL              # ← Change: Your description
 *     tags: [URLs]                           # ← Change: Tag name if needed
 *     requestBody:                           # ← Only for POST/PUT/PATCH
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:                       # ← Change: Add/remove required fields
 *               - url
 *             properties:                    # ← Change: Add/remove/edit fields here
 *               url:                         # ← Change: Field name
 *                 type: string                # ← Change: string/number/boolean/array
 *                 format: uri                 # ← Optional: uri, email, date-time, etc.
 *                 example: https://example.com # ← Change: Example value
 *                 description: The URL to be created # ← Change: Field description
 *     responses:
 *       201:                                 # ← Change: HTTP status code
 *         description: URL created successfully # ← Change: Description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: URL created successfully
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     url:
 *                       type: string
 *                       example: "https://example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:                                 # ← Change: Add/remove status codes
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Bad request - Invalid URL or missing required fields
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Error message"
 * 
 *   get:                                    # ← Change: post/get/put/delete
 *     summary: Get a URL by ID              # ← Change: Your description
 *     tags: [URLs]                           # ← Change: Tag name if needed
 *     requestBody:                           # ← Only for POST/PUT/PATCH
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:                       # ← Change: Add/remove required fields
 *               - id
 *             properties:                    # ← Change: Add/remove/edit fields here
 *               id:                         # ← Change: Field name
 *                 type: string                # ← Change: string/number/boolean/array
 *                 format: uri                 # ← Optional: uri, email, date-time, etc.
 *                 example: 123e4567-e89b-12d3-a456-426614174000 # ← Change: Example value
 *                 description: The ID of the URL to be get # ← Change: Field description
 *     responses:
 *       201:                                 # ← Change: HTTP status code
 *         description: URL get successfully # ← Change: Description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: URL get successfully
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     shortUrl:
 *                       type: string
 *                       example: "https://example.com/123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:                                 # ← Change: Add/remove status codes
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Bad request - Invalid ID or missing required fields
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
