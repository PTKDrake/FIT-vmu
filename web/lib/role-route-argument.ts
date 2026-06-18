export function roleRouteArgument<TRouteArgument>(
  roleId: number,
): TRouteArgument {
  // Wayfinder can emit either string or numeric route-binding types for Spatie roles.
  return { id: roleId } as unknown as TRouteArgument;
}
