const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// Guardar imagen localmente
exports.saveImageLocally = (base64Image, folder, fileName) => {
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const filePath = path.join(__dirname, '..', 'uploads', folder, fileName);

  // Asegurarse de que la carpeta existe
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, buffer);
  console.log(`Imagen guardada localmente en: ${filePath}`);
  return filePath;
};

// Subir imagen a S3
exports.uploadToS3 = async (base64Image, fileName, folder, s3Client) => {
  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error al subir la imagen a S3:', error);
    throw error;
  }
};
