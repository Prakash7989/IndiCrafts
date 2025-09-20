# IndiCrafts Server

## Environment Variables

Create a `.env` in `server/` with:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/indicrafts
JWT_SECRET=replace_me_with_long_random_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Product Image Uploads

- Producers call `POST /api/products` with `multipart/form-data` containing fields: `name, description, price, category, quantity, producerLocation, image`.
- Public listing: `GET /api/products`.
