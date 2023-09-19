import { LocalStorageKey } from '@/constants/localStorage';

export const setLocalStorage = <Value>({ key, value }: { key: LocalStorageKey; value: Value }) => {
  if (value === undefined) return removeLocalStorage({ key });

  const serializedValue = JSON.stringify(value);

  globalThis.localStorage?.setItem(key, serializedValue);
};

export const getLocalStorage = <Value>({
  key,
  defaultValue,
  validateFn,
}: {
  key: LocalStorageKey;
  defaultValue?: Value;
  validateFn?: (value: any) => boolean;
}) => {
  try {
    const unserializedValue = globalThis.localStorage?.getItem(key);

    if (unserializedValue !== null) {
      const value = JSON.parse(unserializedValue) as Value;
      if (validateFn && !validateFn(value)) throw new Error('Unsupported value');

      return value;
    }
  } catch (error) {
    removeLocalStorage({ key });
  }

  return defaultValue!;
};

export const removeLocalStorage = ({ key }: { key: LocalStorageKey }) => {
  globalThis.localStorage?.removeItem(key);
};
