
export const uuid = () => {
  return Date.now().toString();
};

export const formatTimeIntl = (timestamp: number | string): string => {
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(timestamp));
}

