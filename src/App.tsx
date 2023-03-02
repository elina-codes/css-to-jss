import { SyntheticEvent, useState } from "react";
import styles from "./App.module.css";
import { cssToJssString, jssToCssString } from "./helpers";
import ConversionView from "./ConversionView";

type ConversionType = "cssToJss" | "jssToCss";

export default function App() {
  const [type, setType] = useState<ConversionType>("cssToJss");

  const handleCssToJssSubmit = (value: string) => cssToJssString(value);
  const handleJssToCssSubmit = (value: string) => jssToCssString(value);

  const onSwap = (e: SyntheticEvent) => {
    e.preventDefault();
    if (type === "cssToJss") {
      setType("jssToCss");
    } else {
      setType("cssToJss");
    }
  };

  const onSubmit =
    type === "cssToJss" ? handleCssToJssSubmit : handleJssToCssSubmit;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleHighlight}>CSS / JSS Converter</span>
        </h1>
        <h2 className={styles.subTitle}>
          Switch between CSS and JSS with the click of a button.
        </h2>
      </header>
      <main className={styles.content}>
        <ConversionView
          {...{
            onSubmit,
            onSwap,
            type,
          }}
        />
      </main>
    </div>
  );
}
