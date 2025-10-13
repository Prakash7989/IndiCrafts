# IndiCrafts Server

## Environment Variables

Create a `.env` in `server/` with:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/indicrafts
JWT_SECRET=replace_me_with_long_random_secret

# Cloudinary (CURRENT - TEMPORARY)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS S3 (FUTURE - FOR PRODUCTION)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

## Product Image Uploads

- Producers call `POST /api/products` with `multipart/form-data` containing fields: `name, description, price, category, quantity, producerLocation, image`.
- Public listing: `GET /api/products`.

## Image Storage Migration

**Current**: Using Cloudinary for image storage (temporary)
**Future**: Will migrate to AWS S3 for production

### Migration Steps (when ready):

1. Set up AWS S3 bucket and IAM credentials
2. Add AWS env vars to `.env`
3. Uncomment AWS S3 imports in `controllers/productController.js`
4. Comment out Cloudinary code sections
5. Test image upload/delete functionality
6. Deploy with AWS S3 configuration

See `services/awsS3.js` for the AWS implementation.
