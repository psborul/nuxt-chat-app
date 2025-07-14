type Toast = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  timeout?: number;
};

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const addToast = (
    message: string,
    type: Toast["type"] = "info",
    timeout = 3000
  ) => {
    const id = uuid();
    const toast: Toast = { id, message, type, timeout };

    toasts.value.push(toast);

    const remove = () => {
      const index = toasts.value.findIndex((t) => t.id === id);
      if (index !== -1) toasts.value.splice(index, 1);
    };

    setTimeout(remove, timeout);
  };

  const clearToasts = () => {
    toasts.value = [];
  };

  return {
    toasts: readonly(toasts),
    addToast,
    clearToasts,
  };
};
