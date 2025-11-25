export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};
