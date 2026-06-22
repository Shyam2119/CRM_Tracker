export default function Alert({ type = 'error', message, onDismiss }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`mb-4 p-3 border rounded-lg text-sm flex justify-between items-start gap-2 ${styles[type]}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="underline shrink-0 text-xs">
          Dismiss
        </button>
      )}
    </div>
  );
}
