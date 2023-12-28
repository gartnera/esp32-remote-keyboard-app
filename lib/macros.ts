import { KeyCommand } from "./hid"
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Macro {
  name: string
  id?: number,
  isSecret: boolean,
  keyCommands: KeyCommand[]
}

const MacroIdCtrKey = "MACRO_ID_CTR";
const MacroAllIdsKey = "MACRO_ALL_IDS";
const MacroItemPrefix = "MACRO_ITEM";

function macroKey(id: number): string {
  return `${MacroItemPrefix}_${id}`
}

export async function saveMacro(macro: Macro) {
  const rawMacroId = await AsyncStorage.getItem(MacroIdCtrKey);
  const macroId = rawMacroId ? Number(rawMacroId) + 1 : 1;

  const allMacroIdsRaw = await AsyncStorage.getItem(MacroAllIdsKey);
  const allMacroIds: number[] = allMacroIdsRaw ? JSON.parse(allMacroIdsRaw) : [];

  macro.id = macroId;
  allMacroIds.push(macroId);
  await AsyncStorage.setItem(macroKey(macroId), JSON.stringify(macro));
  await AsyncStorage.setItem(MacroIdCtrKey, macroId.toString());
  await AsyncStorage.setItem(MacroAllIdsKey, JSON.stringify(allMacroIds));
}

export async function getMacros(): Promise<Macro[]> {
  const allMacroIdsRaw = await AsyncStorage.getItem(MacroAllIdsKey);
  const allMacroIds: number[] = allMacroIdsRaw ? JSON.parse(allMacroIdsRaw) : [];
  const keys = allMacroIds.map(macroKey)
  const rawMacros = await AsyncStorage.multiGet(keys)
  return rawMacros.map((m) => JSON.parse(m[1]!))
}

export async function deleteMacro(macro: Macro) {
  const allMacroIdsRaw = await AsyncStorage.getItem(MacroAllIdsKey);
  let allMacroIds: number[] = allMacroIdsRaw ? JSON.parse(allMacroIdsRaw) : [];

  allMacroIds = allMacroIds.filter((val) => val != macro.id);
  await AsyncStorage.setItem(MacroAllIdsKey, JSON.stringify(allMacroIds));
  await AsyncStorage.removeItem(macroKey(macro.id!))
}