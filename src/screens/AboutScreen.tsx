// Example: src/screens/AboutScreen.tsx
import useBackHandler from '../hooks/useBackHandler';

const AboutScreen = () => {
  useBackHandler(); // ← just this one line handles back correctly
  return (
    // your screen content
  );
};