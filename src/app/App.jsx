import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Launch from "../pages/Launch";
import Reveal from "../pages/Reveal";
import Titles from "../pages/Titles";
import Seeds from "../pages/Seeds";
import Generating from "../pages/Generating";
import Account from "../pages/Account";
import { generateCoCreativeDream, generateDreamTitles } from "../services/dreamService";
import { syncDream } from "../services/syncService";
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
  [STEPS.TITLES]: Titles,
  [STEPS.SEEDS]: Seeds,
  [STEPS.GENERATING]: Generating,
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
    syncDream(state.journey).catch((error) => {
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

      saveConstellation(emojis) {
        const titles = generateDreamTitles({ emojis });
        dispatch({ type: EVENTS.SAVE_CONSTELLATION, payload: { emojis, titles } });
        trackEvent("constellation_drawn", { emoji_count: emojis.length });
      },

      saveTitle(title, resonance) {
        dispatch({ type: EVENTS.SAVE_TITLE, payload: { title, resonance } });
      },

      saveSeeds(seedCount) {
        dispatch({ type: EVENTS.SAVE_SEEDS, payload: { seedCount } });
        trackEvent("co_created_dream_started", { seed_count: seedCount, credit_cost: 3 });
      },

      completeGeneration() {
        const { journey } = state;
        const dream = generateCoCreativeDream({ emojis: journey.selectedEmojis, title: journey.chosenTitle, resonance: journey.personalResonance, seedCount: journey.seedCount });
        dispatch({ type: EVENTS.REVEAL_DREAM, payload: { dream, generationSeed: dream.seed, templateKey: dream.templateKey } });
        trackEvent("dream_revealed", { emoji_count: journey.selectedEmojis.length, seed_count: journey.seedCount, credit_cost: 3 });
      },

      restart() {
        clearAppState();
        dispatch({ type: EVENTS.RESTART });
      },
    }),
    [initializeNao, state.journey],
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
