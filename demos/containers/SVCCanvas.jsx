import React from 'react';

import { getSVCCanvasData } from '../selectors/index';
import Canvas from '../components/Canvas';
import useSVCConfig from '../hooks/useSVCConfig';

export default function SVCCanvas(props) {
  const { state, actions, ...otherProps } = props;
  const config = useSVCConfig();
  const canvasProps = getSVCCanvasData(state, config);
  return (
    <Canvas
      {...otherProps}
      {...canvasProps}
      addPoint={actions.addPoint}
      labelColors={state.colors}
    />
  );
}
