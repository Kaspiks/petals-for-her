/**
 * Puck plugin - AI Layout panel in left sidebar with direct dispatch access.
 */

import React from "react";
import type { Plugin } from "@puckeditor/core";
import { usePuck } from "@puckeditor/core";
import AIAssistantPanel from "../components/editor/AIAssistantPanel";

export function aiLayoutPlugin(): Plugin {
  return {
    name: "ai-layout",
    label: "AI Layout",
    render: function AILayoutPluginRender() {
      return <AILayoutPluginInner />;
    },
  };
}

function AILayoutPluginInner() {
  const { appState, dispatch } = usePuck();

  const onApply = React.useCallback(
    (newData: { content: unknown[]; root: { props: Record<string, unknown> }; zones?: Record<string, unknown[]> }) => {
      (dispatch as (a: unknown) => void)({ type: "setData", data: newData });
    },
    [dispatch]
  );

  return (
    <AIAssistantPanel
      puckData={appState.data as { content: unknown[]; root: { props: Record<string, unknown> } }}
      onApply={onApply}
    />
  );
}
