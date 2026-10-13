(() => {
  if (!window.Lenis) return;

  window.openPathLenis = new window.Lenis({
    autoRaf: true,
    anchors: true,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true
  });
})();
