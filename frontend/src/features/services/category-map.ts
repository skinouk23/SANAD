/**
 * Service Category Code → Frontend Route Map
 *
 * Maps backend category codes to frontend route paths.
 * Categories not listed here route to `/care/{code}`.
 */

export const CATEGORY_CODE_TO_ROUTE: Record<string, string> = {
  laboratory: '/laboratory',
  radiology: '/radiology',
  gym: '/gym',
  nutrition: '/nutrition-providers',
  ambulance: '/ambulance',
  pharmacy: '/pharmacy',
  funeral: '/funeral',
  veterinary: '/veterinary',
  equipment_rental: '/equipment',
};

/**
 * Returns the route path for a given backend category code.
 */
export function getCategoryRoute(code: string): string {
  return CATEGORY_CODE_TO_ROUTE[code] ?? `/care/${code}`;
}
