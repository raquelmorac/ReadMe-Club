interface SetCurrentActionProps {
  onSetCurrent: (bookId: string) => Promise<void>;
  bookId: string;
  disabled: boolean;
  errorMessage?: string;
}

export function SetCurrentAction({ onSetCurrent, bookId, disabled, errorMessage }: SetCurrentActionProps) {
  return (
    <div>
      <button disabled={disabled} onClick={() => onSetCurrent(bookId)}>
        Move to Current
      </button>
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
    </div>
  );
}
