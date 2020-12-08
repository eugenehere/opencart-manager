export default {
  NOT_SPECIFIED(s: string): string {
    return `'${s}' is not specified.`;
  },
  ENTITY_INSERTED: "The entity has already been inserted.",
  ENTITY_NOT_INSERTED:
    "The entity has not been inserted. Call .insert() first.",
  NO_AFFECTED_ROWS: "No affected rows.",
};
