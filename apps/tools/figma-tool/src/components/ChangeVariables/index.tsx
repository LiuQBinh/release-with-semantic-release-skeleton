import {
  Banner,
  Tabs,
  TabsOption,
  IconWarning16,
  IconInfo16,
  Button,
} from "@create-figma-plugin/ui";
import { Container } from "../Container";
import { h, JSX } from "preact";
import { useState } from "preact/hooks";
import { Color, Mode, Radius, colors, radii, modes } from "../../themes";
import { emit } from "@create-figma-plugin/utilities";
import { version } from "../../../package.json";
import {
  ChangeSelectionThemeHandler,
  ChangeVariablesThemeHandler,
} from "../../utils/types";

const colorKeys = Object.keys(colors) as Color[];
const radiusKeys = Object.keys(radii) as Radius[];

interface TabSelectProps {
  target: "VARIABLES" | "SELECTION";
}

const TabSelect = function ({ target }: TabSelectProps) {
  const [color, setColor] = useState<Color | null>(null);
  const [radius, setRadius] = useState<Radius | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  function handleClickColor(color: Color) {
    setColor(color);
  }

  function handleClickRadius(radius: Radius) {
    setRadius(radius);
  }

  function handleClickMode(mode: Mode) {
    setMode(mode);
  }

  function handleClickApply() {
    if (target === "VARIABLES") {
      emit<ChangeVariablesThemeHandler>(
        "CHANGE_VARIABLES_THEME",
        color,
        radius
      );
    } else if (target === "SELECTION") {
      emit<ChangeSelectionThemeHandler>(
        "CHANGE_SELECTION_THEME",
        color,
        radius,
        mode
      );
    }
  }
  return (
    <div style={{ height: "calc(100% - 41px)" }}>
      {target === "SELECTION" ? (
        <Banner icon={<IconWarning16 />} variant="warning">
          Theme changes won't be possible after applying. It will detach
          variables, apply values to selected nodes
        </Banner>
      ) : (
        <Banner icon={<IconInfo16 />}>
          Apply to variables and affect all nodes. Only works with `SEC Design
          with shadcn/ui` file version {">="} 0.0.9
        </Banner>
      )}

      <div
        style={{
          padding: "16px 24px 48px 24px",
          position: "relative",
          height: "calc(100% - 56px)",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "24px",
          }}>
          <div>
            <label style={{ fontWeight: 500 }}>Color</label>
            <div
              style={{
                display: "grid",
                gap: "8px",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                marginTop: "6px",
              }}>
              {colorKeys.map((colorKey) => (
                <button
                  style={{
                    display: "inline-flex",
                    width: "200px",
                    height: "32px",
                    padding: "0 12px",
                    borderRadius: "6px",
                    border: "1px solid #E4E4E7",
                    boxShadow:
                      "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                    alignItems: "center",
                    ...(color === colorKey
                      ? {
                          border: "2px solid #18181B",
                        }
                      : {}),
                  }}
                  onClick={() => handleClickColor(colorKey)}>
                  <span
                    style={{
                      backgroundColor: colors[colorKey].activeColor.light,
                      borderRadius: "9999px",
                      marginRight: "6px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <span>{colorKey}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 500 }}>Radius</label>
            <div
              style={{
                display: "grid",
                gap: "8px",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                marginTop: "6px",
              }}>
              {radiusKeys.map((radiusKey) => (
                <button
                  style={{
                    display: "inline-flex",
                    height: "32px",
                    padding: "0 12px",
                    borderRadius: "6px",
                    border: "1px solid #E4E4E7",
                    boxShadow:
                      "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    ...(radius === radiusKey
                      ? {
                          border: "2px solid #18181B",
                        }
                      : {}),
                  }}
                  onClick={() => handleClickRadius(radiusKey)}>
                  {radiusKey}
                </button>
              ))}
            </div>
          </div>

          {target === "SELECTION" ? (
            <div>
              <label style={{ fontWeight: 500 }}>Mode</label>
              <div
                style={{
                  display: "grid",
                  gap: "8px",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  marginTop: "6px",
                }}>
                {modes.map((m) => (
                  <button
                    style={{
                      display: "inline-flex",
                      height: "32px",
                      padding: "0 12px",
                      borderRadius: "6px",
                      border: "1px solid #E4E4E7",
                      boxShadow:
                        "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                      alignItems: "center",
                      textAlign: "center",
                      justifyContent: "center",
                      ...(mode === m
                        ? {
                            border: "2px solid #18181B",
                          }
                        : {}),
                    }}
                    onClick={() => handleClickMode(m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontWeight: 500 }}>Mode</label>
              <div
                style={{
                  marginTop: "6px",
                }}>
                <span>
                  This action will apply to both Light and Dark modes.
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "end",
            }}>
            <div>
              <Button
                onClick={handleClickApply}
                style={{
                  width: "200px",
                }}>
                Apply
              </Button>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "12px", right: "20px" }}>
          <span style={{ fontSize: "10px" }}>version {version}</span>
        </div>
      </div>
    </div>
  );
};

const options: TabsOption[] = [
  {
    children: <TabSelect target="VARIABLES" />,
    value: "Apply to variables",
  },
  {
    children: <TabSelect target="SELECTION" />,
    value: "Apply to selection",
  },
];

export function ChangeVariables() {
  const [tab, setTab] = useState<string>("Apply to variables");
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setTab(event.currentTarget.value);
  }

  return (
    <Container>
      <Tabs onChange={handleChange} options={options} value={tab} />
    </Container>
  );
}
