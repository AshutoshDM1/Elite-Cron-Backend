import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../src/config/swagger.config';

const outputPath = path.join(process.cwd(), 'swagger.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
  console.log(`✅ Swagger spec exported successfully to: ${outputPath}`);
  console.log(`📄 File: swagger.json`);
  console.log(`\n💡 You can now import this file into:`);
  console.log(`   - Postman: Import > File > swagger.json`);
  console.log(`   - Insomnia: Import > From File > swagger.json`);
  console.log(`   - Thunder Client: Import > OpenAPI > swagger.json`);
  console.log(`   - Any OpenAPI 3.0 compatible tool`);
} catch (error) {
  console.error('❌ Error exporting Swagger spec:', error);
  process.exit(1);
}
