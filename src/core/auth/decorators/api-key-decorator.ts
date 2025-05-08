import { SetMetadata } from '@nestjs/common';

export const ApiKey = (): ReturnType<typeof SetMetadata> =>
    SetMetadata('apiKey', true);
