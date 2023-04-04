import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  getImageHeightByOriginalRatio(
    originalHeight: number,
    originalWidth: number,
    newWidth?: number,
  ) {
    return newWidth * (originalHeight / originalWidth); // Calculate height based on new width and original ratio
  }

  getImageWidthByOriginalRatio(
    originalHeight: number,
    originalWidth: number,
    newHeight?: number,
  ) {
    return newHeight * (originalWidth / originalHeight); // Calculate width based on new height and original ratio
  }

  getImageHeightWidthByOriginalRatio(
    originalHeight: number,
    originalWidth: number,
    newWidth?: number,
    newHeight?: number,
  ) {
    const newRatio = newWidth / newHeight;
    const originalRatio = originalWidth / originalHeight;
    if (newRatio > originalRatio) {
      // New image is wider than original image
      const height = newWidth * (originalHeight / originalWidth);
      return { height, width: newWidth };
    } else {
      // New image is taller than original image
      const width = newHeight * (originalWidth / originalHeight);
      return { height: newHeight, width };
    }
  }
}
