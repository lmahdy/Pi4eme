import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class OcrService {
    private readonly logger = new Logger(OcrService.name);
    private readonly mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';

    async extractFromImage(imageBuffer: Buffer, filename: string): Promise<{ text: string; parsedRows: Record<string, string>[] }> {
        try {
            this.logger.log(`Sending file to OCR: ${filename} (${imageBuffer.length} bytes) → ${this.mlServiceUrl}/ocr/extract`);

            const formData = new FormData();
            formData.append('file', imageBuffer, { filename });

            const response = await axios.post(`${this.mlServiceUrl}/ocr/extract`, formData, {
                headers: formData.getHeaders(),
                timeout: 30000,
            });

            this.logger.log(`OCR response: ${response.data?.parsedRows?.length ?? 0} rows, ${response.data?.text?.length ?? 0} chars`);
            return response.data;
        } catch (error) {
            this.logger.error(`OCR extraction failed: ${error?.message || error}`);
            if (error?.response?.data) {
                this.logger.error(`OCR error detail: ${JSON.stringify(error.response.data)}`);
            }
            return { text: '', parsedRows: [] };
        }
    }
}
