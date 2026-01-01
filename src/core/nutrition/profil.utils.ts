import { EngineConfig } from "../engine/engine.config";
import { ProfileConfig } from "./profiles";

/**
 * Applique un profil à un EngineConfig existant
 */
export function applyProfileToConfig(
  base: EngineConfig,
  profile: ProfileConfig
): EngineConfig {
  return {
    ...base,
    ...profile.engineOverrides,
  };
}
