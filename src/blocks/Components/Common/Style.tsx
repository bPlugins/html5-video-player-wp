import { useMemo } from 'react';
import camelToKebabCase from '../../../utils/camelToKebabCase';
import { StylesMap } from '../../../interfaces/MyPlayerInterface';

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────

interface StyleProps {
  styles?: StylesMap;
  uniqueId: string;
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

const Style = ({ styles = {}, uniqueId }: StyleProps) => {
  const css = useMemo(() => {
    let result = '';

    if (typeof styles === 'object') {
      for (const key of Object.keys(styles)) {
        const value = styles[key];
        if (typeof value !== 'object') continue;

        const declarations = Object.entries(value)
          .map(([prop, val]) => `${camelToKebabCase(prop)}: ${val};`)
          .join(' ');

        const prefix = ['.', '#'].includes(key[0]) ? '' : '.';
        result += `#${uniqueId} ${prefix}${key}{${declarations}} `;
      }
    }

    result += `#${uniqueId} {--plyr-color-main: ${window.h5vpBlock?.brandColor}}`;
    return result;
  }, [styles, uniqueId]);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export default Style;
