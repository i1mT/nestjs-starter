import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_PLAIN_TEXT_KEY = 'isPlainText';
export const PlainTextRoute = () => SetMetadata(IS_PLAIN_TEXT_KEY, true);
