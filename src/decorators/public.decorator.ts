import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_PUBLIC = 'public'

/**
 * Alias for `@Unprotected`.
 * @since 1.2.0
 */

export const Public = (): CustomDecorator => SetMetadata(META_PUBLIC, true)
