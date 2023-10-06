import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileFormatPipe implements PipeTransform {
  private readonly allowedFormats = ['jpeg', 'jpg', 'png'];

  transform(value: any) {
    const fileExtension = value?.originalname.split('.').pop().toLowerCase();

    if (!this.allowedFormats.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file format. Allowed formats are: ${this.allowedFormats.join(
          ', '
        )}`
      );
    }

    if (value > 5000) {
      throw new BadRequestException('Too large file');
    }

    return value;
  }
}
