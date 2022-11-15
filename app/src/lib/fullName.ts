const fullName = (
  firstName: string | undefined | null,
  lastName: string | undefined | null
) => [firstName, lastName].filter((part) => part).join(' ');

export default fullName;
