<script setup lang="ts">
import pigUrl from '@/assets/pig.png'
import pigMobileUrl from '@/assets/pig-mobile.png'
</script>

<template>
  <div class="loading-state loading-mascot" role="status" aria-live="polite">
    <picture>
      <source :srcset="pigMobileUrl" media="(max-width: 720px)" />
      <img class="loading-mascot__pig" :src="pigUrl" alt="" aria-hidden="true" />
    </picture>
    <p>Carregando....</p>
  </div>
</template>

<style scoped>
.loading-mascot {
  display: grid;
  min-height: min(680px, calc(100vh - 64px));
  place-items: center;
  align-content: center;
  gap: 18px;
  border: 0;
  background: transparent;
  color: var(--color-text);
  padding: 0;
  text-align: center;
}

.loading-mascot picture {
  display: block;
}

.loading-mascot__pig {
  display: block;
  width: clamp(96px, 17vw, 170px);
  height: auto;
  animation:
    loading-pig-blink 1.45s ease-in-out infinite,
    loading-pig-spin 6.2s cubic-bezier(0.35, 0, 0.2, 1) infinite;
  filter: drop-shadow(0 18px 38px color-mix(in srgb, var(--color-primary) 18%, transparent));
  transform-origin: center;
  will-change: opacity, transform;
}

.loading-mascot p {
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 800;
  letter-spacing: 0;
}

@keyframes loading-pig-blink {
  0%,
  42%,
  52%,
  100% {
    opacity: 1;
  }

  47% {
    opacity: 0.28;
  }
}

@keyframes loading-pig-spin {
  0%,
  18%,
  45%,
  72%,
  100% {
    transform: rotate(0deg) scale(1);
  }

  28%,
  34% {
    transform: rotate(360deg) scale(1.04);
  }

  82%,
  88% {
    transform: rotate(-360deg) scale(1.04);
  }
}

@media (max-width: 720px) {
  .loading-mascot {
    min-height: min(560px, calc(100vh - 80px));
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-mascot__pig {
    animation: loading-pig-blink 1.8s ease-in-out infinite;
  }
}
</style>
