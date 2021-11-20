import { useCallback, useMemo, useReducer } from 'react';
import {
  ADD_POINT,
  LABEL_CHANGED,
  CLEAR_POINTS,
  SET_ACTIVE_LABEL,
  UNDO_POINTS,
  REDO_POINTS,
} from '../actions/types';

const initialState = {
  points: [
    [0.098727294921875, 0.6596761474609375],
    [0.380727294921875, 0.6196761474609375],
    [0.388727294921875, 0.8516761474609374],
    [0.222727294921875, 0.8356761474609375],
    [0.650727294921875, 0.7756761474609375],
    [0.622727294921875, 0.6276761474609375],
    [0.894727294921875, 0.6696761474609375],
    [0.826727294921875, 0.8776761474609375],
    [0.292727294921875, 0.3796761474609375],
    [0.324727294921875, 0.1996761474609375],
    [0.120727294921875, 0.1776761474609375],
    [0.172727294921875, 0.3596761474609375],
    [0.578727294921875, 0.4176761474609375],
    [0.572727294921875, 0.3316761474609375],
    [0.860727294921875, 0.1736761474609375],
    [0.774727294921875, 0.2816761474609375],
  ],
  labels: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  history: {
    before: [],
    after: [],
  },
  activeLabel: 0,
};

function canvasPointsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POINT: {
      const newBefore = [
        ...state.history.before,
        {
          points: state.points,
          labels: state.labels,
        },
      ];
      const newPoint = [action.payload.point.x, action.payload.point.y];
      return {
        ...state,
        points: state.points.concat([newPoint]),
        labels: [...state.labels, state.activeLabel],
        history: {
          after: [],
          before: newBefore,
        },
      };
    }
    case LABEL_CHANGED: {
      return {
        ...state,
        activeLabel: action.payload,
      };
    }
    case CLEAR_POINTS: {
      return {
        ...state,
        points: [],
        labels: [],
      };
    }
    case SET_ACTIVE_LABEL: {
      return {
        ...state,
        activeLabel: action.payload,
      };
    }
    case UNDO_POINTS: {
      const before = state.history.before.slice();
      const newData = before.pop();
      const newAfterItem = {
        points: state.points.slice(),
        labels: state.labels.slice(),
      };
      return {
        ...state,
        history: {
          before,
          after: [...state.history.after, newAfterItem],
        },
        points: newData.points,
        labels: newData.labels,
      };
    }
    case REDO_POINTS: {
      const after = state.history.after.slice();
      const newData = after.pop();
      const newBeforeItem = {
        points: state.points.slice(),
        labels: state.labels.slice(),
      };
      return {
        ...state,
        history: {
          after,
          before: [...state.history.before, newBeforeItem],
        },
        points: newData.points,
        labels: newData.labels,
      };
    }
    default:
      return state;
  }
}

export default function useCanvasPoints(colors) {
  const [state, dispatch] = useReducer(canvasPointsReducer, {
    ...initialState,
    colors,
  });
  const addPoint = useCallback((points) => {
    return dispatch({
      type: 'ADD_POINT',
      payload: points,
    });
  }, []);

  const clearPoints = useCallback(() => {
    dispatch({
      type: 'CLEAR_POINTS',
    });
  });

  const setActiveLabel = useCallback((value) => {
    if (value >= colors.length) {
      throw new Error('color out of range');
    }
    dispatch({
      type: SET_ACTIVE_LABEL,
      payload: value,
    });
  });

  const undoPoints = useCallback(() => {
    dispatch({
      type: UNDO_POINTS,
    });
  });

  const redoPoints = useCallback(() => {
    dispatch({
      type: REDO_POINTS,
    });
  });

  const actions = useMemo(() => {
    return {
      addPoint,
      clearPoints,
      setActiveLabel,
      undoPoints,
      redoPoints,
    };
  }, [addPoint, clearPoints]);
  return [state, actions];
}
