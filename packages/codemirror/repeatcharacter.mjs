import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";

const repeatMode = new Compartment();

function repeatPreviousChar(times) {
  return ({ state, dispatch }) => {
    const { from, empty } = state.selection.main;
    if (!empty || from === 0) return false;

    const prevChar = state.doc.sliceString(from - 1, from);
    const text = Array(times).fill(prevChar).join(" ");

    dispatch(state.update({
      changes: {
        from,
        insert: " " + text
      }
    }));

    return true;
  };
}

function exitRepeatMode(view) {
  view.dispatch({
    effects: repeatMode.reconfigure([])
  });
}

const digitBindings = Array.from({ length: 9 }, (_, i) => ({
  key: String(i + 1),
  run(view) {
    repeatPreviousChar(i + 1)(view);
    exitRepeatMode(view);
    return true;
  }
}));

export const repeatCharKeymap = [
    
  repeatMode.of([]),

  keymap.of([
    {
      key: "Alt-r",
      run(view) {
        view.dispatch({
          effects: repeatMode.reconfigure(keymap.of(digitBindings))
        });
        return true;
      }
    }
  ])
];