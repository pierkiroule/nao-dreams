import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Launch from "../pages/Launch";
import Reveal from "../pages/Reveal";
import Account from "../pages/Account";
import { generateDreamBubble } from "../services/dreamService";
import { syncJourney } from "../services/syncService";
import { initializeAnonymousPlayer } from "../services/anonymousPlayer";
import {
  clearAppState,
  loadAppState,
  saveAppState,
} from "../services/journeyService";
import { journeyReducer } from "./journeyMachine";
import { trackEvent } from "../api/analytics";
import { EVENTS, STEPS, initialAppState } from "./state";
import { APP_CONFIG } from "../config/app";

const PAGE_COMPONENTS = {
  [STEPS.HOME]: Home,
  [STEPS.CHOOSE]: Launch,
  [STEPS.REVEAL]: Reveal,
  [STEPS.ACCOUNT]: Account,
};

export default function App() {
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const hasStartedRef = useRef(false);
  const [state, dispatch] = useReducer(
    journeyReducer,
    initialAppState,
    (fallbackState) => loadAppState(fallbackState),
  );

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    syncJourney(state.journey).catch((error) => {
      console.warn("Impossible de synchroniser le rêve.", error);
    });
  }, [state.journey]);

  const initializeNao = useCallback(async () => {
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    setStartError("");
    setIsStarting(true);
    try {
      const profile = await initializeAnonymousPlayer();
      dispatch({ type: EVENTS.CREATE_PROFILE, payload: { profile } });
    } catch (error) {
      setStartError(error.message || "Impossible de préparer ton identité onirique.");
      hasStartedRef.current = false;
    } finally {
      setIsStarting(false);
    }
  }, []);

  useEffect(() => {
    initializeNao();
  }, [initializeNao]);

  const actions = useMemo(
    () => ({
      retryStart() {
        initializeNao();
      },

      openAccount() {
        dispatch({ type: EVENTS.OPEN_ACCOUNT });
      },

      closeAccount() {
        dispatch({ type: EVENTS.CLOSE_ACCOUNT });
      },

      startDream() {
        dispatch({
          type: EVENTS.START_DREAM,
          payload: {
            naoId: APP_CONFIG.defaultNaoId,
            seriesId: APP_CONFIG.defaultSeriesId,
          },
        });
      },

      async reveal(selections) {
        const dream = await generateDreamBubble(selections);
        dispatch({
          type: EVENTS.REVEAL_DREAM,
          payload: {
            selections,
            dream,
          },
        });
        trackEvent("dream_revealed", { constellation: selections.networkId, emoji_ids: selections.bubbleIds });
      },

      restart() {
        clearAppState();
        dispatch({ type: EVENTS.RESTART });
      },
    }),
    [initializeNao],
  );

  const CurrentPage = PAGE_COMPONENTS[state.step] ?? Home;
  return (
    <Layout>
      <CurrentPage
        state={state}
        journey={state.journey}
        profile={state.profile}
        isStarting={isStarting}
        startError={startError}
        actions={actions}
      />
    </Layout>
  );
}
