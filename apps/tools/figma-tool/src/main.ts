import { on, showUI } from "@create-figma-plugin/utilities";
import {
  ChangeSelectionThemeHandler,
  ChangeVariablesThemeHandler,
  GetThemeHandler,
} from "./utils/types";
import {
  changeSelectionTheme,
  changeVariablesTheme,
} from "./utils/functionChangeVariables";
import { convertThemeToJson } from "./utils/getTheme";

export default function () {
  on<ChangeVariablesThemeHandler>(
    "CHANGE_VARIABLES_THEME",
    changeVariablesTheme
  );
  on<ChangeSelectionThemeHandler>(
    "CHANGE_SELECTION_THEME",
    changeSelectionTheme
  );
  on<GetThemeHandler>("GET_THEME", convertThemeToJson);
  showUI({
    height: 500,
    width: 900,
  });
}
