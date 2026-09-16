//! WIP...

export function route(httpMethod, uri, handlerName = "", handlerMethod = () => {}) {
  return (r = {
    router: null,
    prefix: null,
    controller: null,
    httpMethod: httpMethod,
    uri: uri,
    handlerName: handlerName,
    handlerMethod: handlerMethod,
  });
}
export function routeBuilder(router, listOfRouteData) {}
