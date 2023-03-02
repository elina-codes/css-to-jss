import {create} from 'jss'
import nested from 'jss-plugin-nested'

  // CSS to JSS

  export interface CSSObject {
    [key: string]: string | number | CSSObject;
  }

  function cssToJss(cssString: string): CSSObject {
    // Remove comments and empty lines
    const cssRules = cssString.replace(/\/\*[\s\S]*?\*\//g, "").split(/\s*}\s*/gm).filter(Boolean);
  
    const jssObject: CSSObject = {};
  
    for (let i = 0; i < cssRules.length; i++) {
      // Split the selector and the styles
      const rule = cssRules[i].trim().split(/\s*{\s*/);
      const selector = rule[0].replace(/^\./, "");
      const styleString = rule[1].replace(/\s*}\s*$/, "");
      const styles = styleString.split(";").filter(Boolean);
  
      let jssStyles: CSSObject = {};
  
      for (let j = 0; j < styles.length; j++) {
        // Split the property and the value
        const [property, value] = styles[j].split(":").map((s: string) => s.trim());
        // Convert the property to camelCase
        const camelCasedProperty = property.replace(
          /-([a-z])/g,
          (match: string, group1: string) => group1.toUpperCase()
        );
        // Convert the value to a number if it's a number
        jssStyles[camelCasedProperty] = isNaN(Number(value))
          ? value
          : Number(value);
      }
  
      // Split the selector to get the pseudo selectors
      const selectorParts = selector.split(':')
      const jssSelector = selectorParts.shift() || ''
      const jssNestedStyles: CSSObject = {};
      // Add the nested styles
      if (selectorParts.length) {
        jssNestedStyles['&:' + selectorParts.join(':')] = jssStyles;
        jssStyles = jssNestedStyles
      }
      
      // Add the styles to the JSS object
      jssObject[jssSelector] = {
        ...(jssObject[jssSelector || ""] as CSSObject),
        ...jssStyles
      };
    }
  
    return jssObject;
  }

  export const cssToJssString = (input: string) => {
    const converted = cssToJss(input);
    return JSON.stringify(converted, null, 2);
  };



  // JSS to CSS

  export interface JssObject {
    [key: string]: {
      [key: string]: string | number;
    };
  }

  const jssToCss = (input: JssObject) => {  
    // Remove the JSS generated ID
    const createGenerateId = () => {
      return (rule: { key: string }) => rule.key
    }
    const jss = create({
      plugins: [nested()],
      createGenerateId
    });
    
    const sheet = jss.createStyleSheet(input)
    const result = sheet.toString()
    return result
  }

  const parseJss = (input: string) => {
    // Format the JSS string to be valid JSON
    let jssc = input
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/([{]\s*)([a-zA-Z0-9_]+)\s*{/g, '$1"$2":{')
      .replaceAll("\n", "")
      .replaceAll("  ", "")
      .replaceAll(",}", "}")
      .replaceAll("},", "},\n");
    if (jssc[jssc.length - 1] === ",") jssc = jssc.slice(0, -1);
    return JSON.parse(jssc);
  };
  

  export const jssToCssString = (input: string) => {
    const parsed = parseJss(input);
    return jssToCss(parsed);
  };