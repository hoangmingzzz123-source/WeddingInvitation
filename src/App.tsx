import { MotionConfig } from 'motion/react';
import { Router } from './Router';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router />
    </MotionConfig>
  );
}
