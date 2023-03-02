import { SyntheticEvent, useState, useRef, useEffect } from "react";
import {
  MdOutlineSwapHoriz as SwapIcon,
  MdContentCopy as CopyIcon,
  MdDoubleArrow as ConvertIcon,
  MdCheck as ConfirmCopyIcon,
} from "react-icons/md";
import { useCopyToClipboard } from "usehooks-ts";
import styles from "./ConversionView.module.css";

interface ConversionViewProps {
  onSubmit: (value: string) => string;
  onSwap: (e: SyntheticEvent) => void;
  type: "cssToJss" | "jssToCss";
}

export default function ConversionView({
  onSubmit,
  onSwap,
  type = "cssToJss",
}: ConversionViewProps) {
  const [, copy] = useCopyToClipboard();
  const input = type === "cssToJss" ? "css" : "jss";
  const output = type === "cssToJss" ? "jss" : "css";
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isConfirmCopyVisible, setIsConfirmCopyVisible] = useState(false);

  const handleCopyClick = (e: SyntheticEvent) => {
    e.preventDefault();
    copy(result);
    setIsConfirmCopyVisible(true);
  };

  useEffect(() => {
    if (isConfirmCopyVisible) {
      const timeout = setTimeout(() => setIsConfirmCopyVisible(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isConfirmCopyVisible]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    reset();

    try {
      const inputValue = inputRef?.current?.value || "";
      const converted = await onSubmit(inputValue);
      setResult(converted);
      return converted;
    } catch (e) {
      console.error(e);
      setError(true);
      return "";
    }
  };

  const reset = () => {
    setResult("");
    setError(false);
  };

  const handleReset = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.value = "";
    reset();
  };

  const handleSwapClick = (e: SyntheticEvent) => {
    handleReset(e);
    onSwap(e);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <label className={styles.label}>
        {input.toUpperCase()}{" "}
        {error && (
          <span className={styles.error}>
            Error: invalid {input.toUpperCase()}
          </span>
        )}
        <textarea
          id={input}
          name={input}
          rows={10}
          cols={30}
          className={styles.codeContainer}
          ref={inputRef}
        />
      </label>

      <div className={styles.buttonContainer}>
        <button title="Convert" type="submit" className={styles.submitButton}>
          <ConvertIcon size={30} />
        </button>
        <button
          title="Reset"
          onClick={handleReset}
          className={styles.resetButton}
        >
          Reset
        </button>
        <button
          title="Swap"
          onClick={handleSwapClick}
          className={styles.swapButton}
        >
          <SwapIcon size={50} />
        </button>
      </div>

      <label className={styles.label}>
        {output.toUpperCase()}
        <div className={styles.outputWrapper}>
          <textarea
            value={result}
            id={output}
            name={output}
            className={styles.codeContainer}
            readOnly
          />
          <button
            onClick={handleCopyClick}
            className={styles.copyButton}
            disabled={!result}
            title="Copy to clipboard"
          >
            {isConfirmCopyVisible ? (
              <ConfirmCopyIcon size={30} color="#20c437" />
            ) : (
              <CopyIcon size={30} />
            )}
          </button>
        </div>
      </label>
    </form>
  );
}
