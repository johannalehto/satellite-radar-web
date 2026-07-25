let isConfigured = false

export function configureCanvasKitWebGL1() {
  if (isConfigured) {
    return
  }

  const getWebGLContext = globalThis.CanvasKit.GetWebGLContext.bind(
    globalThis.CanvasKit,
  )

  // CanvasKit defaults to WebGL2, which loses its context in some browsers
  // before Skia creates its graphics context. WebGL1 is sufficient for this
  // renderer and avoids that startup failure.
  globalThis.CanvasKit.GetWebGLContext = (canvas, options) =>
    getWebGLContext(canvas, {
      ...options,
      majorVersion: 1,
    })

  isConfigured = true
}
