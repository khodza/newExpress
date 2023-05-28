async function processMiddleware(middlewareStack, req, res) {
  if (!middlewareStack || middlewareStack.length === 0) {
    // Resolve true if there are no middleware functions
    return true;
  }
  for (const middleware of middlewareStack) {
    await new Promise((resolve) => {
      middleware(req, res, () => {
        resolve();
      });
    });
  }

  return true;
}

module.exports = processMiddleware;
