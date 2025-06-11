import React, { type ComponentType, type SVGProps } from 'react';

/**
 * Ensures an imported SVG component is compatible with styled-components.
 */
export function wrapSvgComponent(Icon: ComponentType<SVGProps<SVGSVGElement>>) {
  // eslint-disable-next-line react/display-name
  return (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
}
